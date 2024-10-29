import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ipfsClient from '../utils/ipfsClient';
import { Buffer } from 'buffer';
import { saveIpfsHashToBlockchain } from '../utils/ethereum';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [blockchainStatus, setBlockchainStatus] = useState('idle');

  // 게시물을 텍스트 형식으로 변환
  const convertToText = () => {
    if (!post) return '';

    return `
=== 사이버 공격 분석 리포트 ===

[Header]
Report ID: ${post.reportId || 'N/A'}
Data Analyst: ${post.analyst || 'N/A'}

[Attack Details]
Name: ${post.attackName || 'N/A'}
Type: ${post.attackType || 'N/A'}
Severity Level: ${post.severityLevel?.toUpperCase() || 'N/A'}
Discovered By: ${post.discoveredBy || 'N/A'}
Affected System: ${post.affectedSystem || 'N/A'}

[Behavioral Description]
System Behavior:
${post.systemBehavior || 'No description provided'}

Network Behavior:
${post.networkBehavior || 'No description provided'}

[Sysmon Data]
Event ID: ${post.eventId || 'N/A'}
Process: ${post.process || 'N/A'}
File Registry: ${post.fileRegistry || 'N/A'}
Network: ${post.networkData || 'N/A'}

[Technical Details]
Hash: ${post.hash || 'N/A'}

Code:
${post.code || 'No code provided'}

Trigger:
${post.trigger || 'No trigger information provided'}

[Detection and Migration]
${post.detectionMethod || 'No detection method provided'}

[Additional Finding]
Related Incident: ${post.relatedIncident || 'N/A'}
IoC: ${post.ioc || 'N/A'}

Generated at: ${new Date().toLocaleString()}
    `.trim();
  };

  // IPFS에 업로드
  const uploadToIPFS = async () => {
    try {
      setUploadStatus('uploading');
      setErrorMessage('');
      
      console.log('업로드 시작...');
      const text = convertToText();
      const buffer = Buffer.from(text);

      console.log('IPFS에 업로드 중...');
      const result = await ipfsClient.add(buffer);
      
      console.log('업로드 결과:', result);
      setIpfsHash(result.path);
      setUploadStatus('success');

      const ipfsUrl = `https://ipfs.io/ipfs/${result.path}`;
      console.log('IPFS URL:', ipfsUrl);

      const uploadHistory = JSON.parse(localStorage.getItem('ipfsUploads') || '[]');
      uploadHistory.push({
        hash: result.path,
        url: ipfsUrl,
        timestamp: new Date().toISOString(),
        reportId: post.reportId
      });
      localStorage.setItem('ipfsUploads', JSON.stringify(uploadHistory));

      // 블록체인에 저장
      await saveToBlockchain(result.path);

    } catch (error) {
      console.error('IPFS 업로드 에러:', error);
      setErrorMessage(error.message);
      setUploadStatus('error');
    }
  };

  const saveToBlockchain = async (ipfsHash) => {
    try {
      setBlockchainStatus('saving');
      const transactionHash = await saveIpfsHashToBlockchain(ipfsHash, post.reportId);
      setTxHash(transactionHash);
      setBlockchainStatus('success');
    } catch (error) {
      console.error('Blockchain error:', error);
      setBlockchainStatus('error');
      setErrorMessage(error.message);
    }
  };

  // 업로드 상태에 따른 알림 컴포넌트
  const UploadStatusAlert = () => {
    switch (uploadStatus) {
      case 'uploading':
        return (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500 mx-auto"></div>
              <p className="text-center mt-4">IPFS에 업로드 중...</p>
            </div>
          </div>
        );
      
      case 'success':
        return (
          <div className="bg-green-50 p-4 rounded-lg mt-4">
            <p className="text-green-800">업로드 성공!</p>
            <p className="text-sm text-green-600 mt-1">IPFS Hash: {ipfsHash}</p>
            <a 
              href={`https://ipfs.io/ipfs/${ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm block mt-2"
            >
              IPFS에서 보기
            </a>
          </div>
        );
      
      case 'error':
        return (
          <div className="bg-red-50 p-4 rounded-lg mt-4">
            <p className="text-red-800">업로드 실패</p>
            <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  const StatusAlert = () => {
    if (blockchainStatus === 'saving') {
      return (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-center mt-4">블록체인에 저장 중...</p>
          </div>
        </div>
      );
    }

    if (blockchainStatus === 'success') {
      return (
        <div className="bg-green-50 p-4 rounded-lg mt-4">
          <p className="text-green-800 font-semibold">블록체인 저장 성공!</p>
          <p className="text-sm text-green-600 mt-1">
            Transaction Hash: {txHash}
          </p>
          <a 
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm block mt-2"
          >
            Etherscan에서 보기
          </a>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const foundPost = posts.find(p => p.id === parseInt(id));
    if (foundPost) {
      setPost(foundPost);
    } else {
      alert('게시글을 찾을 수 없습니다.');
      navigate('/bulletin-board');
    }
  }, [id, navigate]);

  if (!post) return <div>로딩중...</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* 상단 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white">사이버 공격 분석 리포트</h1>
          <p className="text-blue-100 mt-2">Report ID: {post.reportId}</p>
        </div>

        {/* Header 섹션 */}
        <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span className="bg-blue-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">1</span>
            Header
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Report ID</p>
              <p className="font-medium">{post.reportId || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Data Analyst</p>
              <p className="font-medium">{post.analyst || 'N/A'}</p>
            </div>
          </div>
        </section>

        {/* Attack Details 섹션 */}
        <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span className="bg-red-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">2</span>
            Attack Details
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Attack Name</p>
              <p className="font-medium">{post.attackName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Attack Type</p>
              <p className="font-medium">{post.attackType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Severity Level</p>
              <p className={`font-medium ${
                post.severityLevel ? (
                  post.severityLevel === 'critical' ? 'text-red-600' :
                  post.severityLevel === 'high' ? 'text-orange-600' :
                  post.severityLevel === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                ) : 'text-gray-600'
              }`}>
                {post.severityLevel?.toUpperCase() || 'NOT SPECIFIED'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Affected System</p>
              <p className="font-medium">{post.affectedSystem}</p>
            </div>
          </div>
        </section>

        {/* Behavioral Description 섹션 */}
        <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span className="bg-green-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">3</span>
            Behavioral Description
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">System Behavior</p>
              <p className="mt-2 whitespace-pre-wrap">{post.systemBehavior || 'No behavior description provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Network Behavior</p>
              <p className="mt-2 whitespace-pre-wrap">{post.networkBehavior}</p>
            </div>
          </div>
        </section>

        {/* Sysmon Data 섹션 */}
        <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span className="bg-purple-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">4</span>
            Sysmon Data
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Event ID</p>
              <p className="font-medium">{post.eventId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Process</p>
              <p className="font-medium">{post.process}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">File Registry</p>
              <p className="font-medium">{post.fileRegistry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Network Data</p>
              <p className="font-medium">{post.networkData}</p>
            </div>
          </div>
        </section>

        {/* Technical Details 섹션 */}
        <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
            <span className="bg-indigo-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">5</span>
            Technical Details
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Hash</p>
              <p className="font-mono bg-gray-50 p-2 rounded mt-1">{post.hash || 'No hash value provided'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Code</p>
              <pre className="font-mono bg-gray-50 p-4 rounded mt-1 overflow-x-auto">
                {post.code || 'No code provided'}
              </pre>
            </div>
            <div>
              <p className="text-sm text-gray-500">Trigger</p>
              <p className="whitespace-pre-wrap">{post.trigger}</p>
            </div>
          </div>
        </section>

        {/* 하단 버튼 그룹 수정 */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={uploadToIPFS}
            disabled={uploadStatus === 'uploading'}
            className={`px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center ${
              uploadStatus === 'uploading' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploadStatus === 'uploading' ? 'Uploading...' : 'IPFS에 업로드'}
          </button>
          
          <button
            onClick={() => navigate('/bulletin-board')}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
          >
            목록으로
          </button>
        </div>

        {/* 업로드 상태 표시 */}
        <UploadStatusAlert />
        <StatusAlert />
      </div>
    </div>
  );
}

export default PostDetail; 