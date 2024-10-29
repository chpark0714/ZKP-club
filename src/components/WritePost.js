import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function WritePost() {
  const navigate = useNavigate();
  
  // Header 섹션
  const [reportId, setReportId] = useState('');
  const [analyst, setAnalyst] = useState('');
  
  // Attack Details 섹션
  const [attackName, setAttackName] = useState('');
  const [attackType, setAttackType] = useState('');
  const [severityLevel, setSeverityLevel] = useState('low');
  const [discoveredBy, setDiscoveredBy] = useState('');
  const [affectedSystem, setAffectedSystem] = useState('');
  
  // Behavioral Description 섹션
  const [systemBehavior, setSystemBehavior] = useState('');
  const [networkBehavior, setNetworkBehavior] = useState('');
  
  // Sysmon Data 섹션
  const [eventId, setEventId] = useState('');
  const [process, setProcess] = useState('');
  const [fileRegistry, setFileRegistry] = useState('');
  const [networkData, setNetworkData] = useState('');
  
  // Suricata Alerts 섹션
  const [alertId, setAlertId] = useState('');
  const [signature, setSignature] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [timestamp, setTimestamp] = useState('');
  
  // Technical Details 섹션
  const [hash, setHash] = useState('');
  const [code, setCode] = useState('');
  const [trigger, setTrigger] = useState('');
  
  // Detection and Migration 섹션
  const [detectionMethod, setDetectionMethod] = useState('');
  
  // Additional Finding 섹션
  const [relatedIncident, setRelatedIncident] = useState('');
  const [ioc, setIoc] = useState('');

  // 공통 스타일 업데이트
  const inputClassName = "mt-1 block w-full rounded-lg border-2 border-gray-200 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all duration-200 p-2 hover:border-gray-300";
  const textareaClassName = "mt-1 block w-full rounded-lg border-2 border-gray-200 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all duration-200 p-2 hover:border-gray-300";

  // 특별한 입력 필드를 위한 추가 스타일 (예: 코드 입력)
  const codeInputClassName = `${textareaClassName} font-mono`;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newReport = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      header: { reportId, analyst },
      attackDetails: { 
        name: attackName,
        type: attackType,
        severityLevel,
        discoveredBy,
        affectedSystem
      },
      behavioralDescription: {
        system: systemBehavior,
        network: networkBehavior
      },
      sysmonData: {
        eventId,
        process,
        fileRegistry,
        network: networkData
      },
      suricataAlerts: {
        alertId,
        signature,
        ipAddress,
        timestamp
      },
      technicalDetails: {
        hash,
        code,
        trigger
      },
      detectionMethod,
      additionalFindings: {
        relatedIncident,
        ioc
      }
    };

    // localStorage에 저장
    const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    const updatedPosts = [newReport, ...existingPosts];
    localStorage.setItem('posts', JSON.stringify(updatedPosts));

    navigate('/bulletin-board');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-white">사이버 공격 리포트 작성</h1>
          <p className="text-blue-100 mt-2">상세한 공격 분석 리포트를 작성해주세요</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="bg-blue-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">1</span>
              Header
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report ID
                </label>
                <input
                  type="text"
                  value={reportId}
                  onChange={(e) => setReportId(e.target.value)}
                  className={inputClassName}
                  required
                  placeholder="리포트 ID를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Analyst
                </label>
                <input
                  type="text"
                  value={analyst}
                  onChange={(e) => setAnalyst(e.target.value)}
                  className={inputClassName}
                  required
                  placeholder="분석가 이름을 입력하세요"
                />
              </div>
            </div>
          </section>

          {/* Attack Details 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-red-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="bg-red-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">2</span>
              Attack Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Attack Name</label>
                <input
                  type="text"
                  value={attackName}
                  onChange={(e) => setAttackName(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Attack Type</label>
                <input
                  type="text"
                  value={attackType}
                  onChange={(e) => setAttackType(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Severity Level</label>
                <select
                  value={severityLevel}
                  onChange={(e) => setSeverityLevel(e.target.value)}
                  className={inputClassName}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discovered By</label>
                <input
                  type="text"
                  value={discoveredBy}
                  onChange={(e) => setDiscoveredBy(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Affected System</label>
                <input
                  type="text"
                  value={affectedSystem}
                  onChange={(e) => setAffectedSystem(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
            </div>
          </section>

          {/* Behavioral Description 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="bg-green-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">3</span>
              Behavioral Description
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">System Behavior</label>
                <textarea
                  value={systemBehavior}
                  onChange={(e) => setSystemBehavior(e.target.value)}
                  rows={4}
                  className={textareaClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Network Behavior</label>
                <textarea
                  value={networkBehavior}
                  onChange={(e) => setNetworkBehavior(e.target.value)}
                  rows={4}
                  className={textareaClassName}
                  required
                />
              </div>
            </div>
          </section>

          {/* Sysmon Data 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="bg-purple-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">4</span>
              Sysmon Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Event ID</label>
                <input
                  type="text"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Process</label>
                <input
                  type="text"
                  value={process}
                  onChange={(e) => setProcess(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">File Registry</label>
                <input
                  type="text"
                  value={fileRegistry}
                  onChange={(e) => setFileRegistry(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Network Data</label>
                <input
                  type="text"
                  value={networkData}
                  onChange={(e) => setNetworkData(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
            </div>
          </section>

          {/* Suricata Alerts 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="bg-yellow-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">5</span>
              Suricata Alerts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Alert ID</label>
                <input
                  type="text"
                  value={alertId}
                  onChange={(e) => setAlertId(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Signature</label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">IP Address</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                <input
                  type="datetime-local"
                  value={timestamp}
                  onChange={(e) => setTimestamp(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
            </div>
          </section>

          {/* Technical Details 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-indigo-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="bg-indigo-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">6</span>
              Technical Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hash</label>
                <input
                  type="text"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={4}
                  className={codeInputClassName}
                  required
                  placeholder="관련 코드를 입력하세요"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trigger</label>
                <textarea
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  rows={3}
                  className={textareaClassName}
                  required
                />
              </div>
            </div>
          </section>

          {/* Detection and Migration 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-pink-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="bg-pink-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">7</span>
              Detection and Migration
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700">Detection Method</label>
              <textarea
                value={detectionMethod}
                onChange={(e) => setDetectionMethod(e.target.value)}
                rows={4}
                className={textareaClassName}
                required
              />
            </div>
          </section>

          {/* Additional Finding 섹션 */}
          <section className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-teal-500">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <span className="bg-teal-500 w-8 h-8 rounded-full text-white flex items-center justify-center mr-2 text-sm">8</span>
              Additional Finding
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Related Incident</label>
                <textarea
                  value={relatedIncident}
                  onChange={(e) => setRelatedIncident(e.target.value)}
                  rows={3}
                  className={textareaClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Indication of Compromise (IoC)</label>
                <textarea
                  value={ioc}
                  onChange={(e) => setIoc(e.target.value)}
                  rows={3}
                  className={textareaClassName}
                  required
                />
              </div>
            </div>
          </section>

          {/* Submit 버튼 */}
          <div className="flex justify-end gap-4 sticky bottom-4 bg-gray-100 p-4 rounded-lg shadow-lg">
            <button
              type="button"
              onClick={() => navigate('/bulletin-board')}
              className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WritePost; 