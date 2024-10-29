import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as snarkjs from 'snarkjs';

function LoginPage() {
    const [secret, setSecret] = useState('');
    const [file, setFile] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();
  
    // 로그인 상태가 변경될 때 리디렉션
    useEffect(() => {
      if (loggedIn) {
        navigate('/bulletin-board');
      }
    }, [loggedIn, navigate]);
  
    const generateZKP = async (secret) => {
      const circuitWasmPath = '/hash.wasm';
      const zkeyPath = '/hash_0001.zkey';
  
      const input = { secret: secret };
  
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, circuitWasmPath, zkeyPath);
  
      return { proof, publicSignals };
    };
  
    const verifyZKP = async (proof, publicSignals) => {
      const vkeyPath = '/verification_key.json';
      const vkey = await fetch(vkeyPath).then(res => res.json());
  
      return await snarkjs.groth16.verify(vkey, publicSignals, proof);
    };
  
    const saveZKPFile = (zkpData) => {
      const blob = new Blob([JSON.stringify(zkpData)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'zkp_proof.json';
      a.click();
      URL.revokeObjectURL(url);
    };
  
    const handleSignup = async () => {
      if (!secret) {
        alert('비밀값을 입력해주세요.');
        return;
      }
      try {
        const zkpData = await generateZKP(secret);
        saveZKPFile(zkpData);
        alert('ZKP 증명 파일이 생성되었습니다. 다운로드를 시작합니다.');
      } catch (error) {
        console.error('ZKP 생성 중 오류 발생:', error);
        alert('ZKP 생성 중 오류가 발생했습니다.');
      }
    };
  
    const handleLogin = async () => {
      if (!file) {
        alert('ZKP 증명 파일을 업로드해주세요.');
        return;
      }
  
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileContent = JSON.parse(e.target.result);
          const isValid = await verifyZKP(fileContent.proof, fileContent.publicSignals);
          if (isValid) {
            alert('로그인 성공!');
            setLoggedIn(true); // 로그인 상태 업데이트
          } else {
            alert('유효하지 않은 ZKP 증명입니다.');
          }
        } catch (error) {
          console.error('ZKP 검증 중 오류 발생:', error);
          alert('ZKP 검증 중 오류가 발생했습니다.');
        }
      };
      reader.readAsText(file);
    };
  
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
                    ZKP 인증 시스템
                </h1>

                {/* 회원가입 섹션 */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        회원가입
                    </h2>
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            value={secret} 
                            onChange={(e) => setSecret(e.target.value)} 
                            placeholder="비밀값 입력"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                        <button 
                            onClick={handleSignup}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            ZKP 생성하기
                        </button>
                    </div>
                </div>

                {/* 구분선 */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">또는</span>
                    </div>
                </div>

                {/* 로그인 섹션 */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        로그인
                    </h2>
                    <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center w-full">
                            <label 
                                htmlFor="file-upload"
                                className="w-full flex flex-col items-center px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-gray-600">ZKP 파일을 선택하거나 드래그하세요</span>
                                <input 
                                    id="file-upload"
                                    type="file" 
                                    onChange={(e) => setFile(e.target.files[0])} 
                                    className="hidden"
                                />
                            </label>
                            {file && (
                                <span className="mt-2 text-sm text-gray-500">
                                    선택된 파일: {file.name}
                                </span>
                            )}
                        </div>
                        <button 
                            onClick={handleLogin}
                            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            로그인
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage; 