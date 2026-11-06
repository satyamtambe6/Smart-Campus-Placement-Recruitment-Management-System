import React, { useState } from 'react';
import { BACKEND_FILES, BackendFile } from '../../data/backendCodeFiles';
import {
  Code2,
  FileText,
  Copy,
  Check,
  Download,
  Terminal,
  Database,
  Shield,
  Layers,
  FolderGit2,
  ExternalLink,
  ChevronRight,
  Server,
} from 'lucide-react';

export const BackendExplorerView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<BackendFile>(BACKEND_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeGuideTab, setActiveGuideTab] = useState<'CODE' | 'SETUP' | 'APIS'>('CODE');

  const categories = ['ALL', 'Configuration', 'Database', 'Model', 'Security', 'Service', 'Controller'];

  const filteredFiles = BACKEND_FILES.filter(
    (f) => activeCategory === 'ALL' || f.category === activeCategory
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (file: BackendFile) => {
    const element = document.createElement('a');
    const blob = new Blob([file.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(blob);
    element.download = file.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Spring Boot 3.2 + PostgreSQL 15
            </span>
            <span>·</span>
            <span>RESTful Micro-architecture</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Backend Architecture & Source Code Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Complete production-grade Spring Boot backend files, Spring Security 6 JWT filter chains, JPA entities, and PostgreSQL DDL.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActiveGuideTab('CODE')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeGuideTab === 'CODE' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Source Files ({BACKEND_FILES.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveGuideTab('SETUP')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeGuideTab === 'SETUP' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            How to Run Guide
          </button>
          <button
            type="button"
            onClick={() => setActiveGuideTab('APIS')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeGuideTab === 'APIS' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            REST Endpoints
          </button>
        </div>
      </div>

      {/* TAB 1: CODE EXPLORER */}
      {activeGuideTab === 'CODE' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Tree Sidebar (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1 pb-3 border-b border-slate-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* File List */}
            <div className="space-y-1 max-h-[600px] overflow-y-auto">
              {filteredFiles.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-blue-50/80 border border-blue-200 text-blue-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <FileText
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isSelected ? 'text-blue-600' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate leading-tight">{file.name}</p>
                      <span className="text-[10px] text-slate-400 block truncate font-mono mt-0.5">
                        {file.category} · {file.language}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer Panel (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            {/* Top Toolbar */}
            <div className="h-12 bg-slate-950 px-4 flex items-center justify-between border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <span className="text-blue-400 font-bold">{selectedFile.path}</span>
                <span className="text-slate-500">({selectedFile.language})</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(selectedFile)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>

            {/* Description Sub-banner */}
            <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/80 text-[11px] text-slate-400">
              {selectedFile.description}
            </div>

            {/* Code Body with line numbers */}
            <div className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-[550px] overflow-y-auto selection:bg-blue-600 selection:text-white">
              <pre className="text-slate-200">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HOW TO RUN GUIDE */}
      {activeGuideTab === 'SETUP' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6 text-xs text-slate-700 leading-relaxed">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-2">
              Step-by-Step Setup & Execution Manual
            </h2>

            {/* Step 1 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  1
                </span>
                PostgreSQL Database Initialization
              </h3>
              <p className="text-slate-600">
                Ensure PostgreSQL 14+ is installed and running on your local machine or Docker container.
              </p>
              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono">
                <code>
                  # Connect to PostgreSQL CLI<br />
                  psql -U postgres<br /><br />
                  # Create the placement database<br />
                  CREATE DATABASE campus_placement_db;<br /><br />
                  # Exit psql and execute the DDL schema and seed records<br />
                  psql -U postgres -d campus_placement_db -f backend/src/main/resources/schema.sql<br />
                  psql -U postgres -d campus_placement_db -f backend/src/main/resources/data.sql
                </code>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  2
                </span>
                Spring Boot Backend Execution
              </h3>
              <p className="text-slate-600">
                Navigate to the backend folder and compile with Maven:
              </p>
              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono">
                <code>
                  cd backend<br /><br />
                  # Clean and build with dependencies<br />
                  mvn clean install<br /><br />
                  # Launch Spring Boot server (Default: port 8080)<br />
                  mvn spring-boot:run
                </code>
              </div>
              <p className="text-slate-500">
                The Spring Boot REST server will start on <strong className="text-slate-800 font-mono">http://localhost:8080/api</strong> with HikariCP connection pool and JWT validation active.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                  3
                </span>
                React Frontend Execution
              </h3>
              <div className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono">
                <code>
                  # Install Node dependencies<br />
                  npm install<br /><br />
                  # Run the development server<br />
                  npm run dev
                </code>
              </div>
              <p className="text-slate-500">
                The frontend runs on <strong className="text-slate-800 font-mono">http://localhost:3000</strong> with hot reload and proxy enabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REST API ENDPOINTS */}
      {activeGuideTab === 'APIS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900">RESTful API Endpoints Specification</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Role-Based Access Control enforced via Spring Security 6 and JSON Web Tokens.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Method</th>
                  <th className="p-3.5">Endpoint URI</th>
                  <th className="p-3.5">Required Role</th>
                  <th className="p-3.5">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                <tr>
                  <td className="p-3.5 font-bold text-emerald-700">POST</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/auth/login</td>
                  <td className="p-3.5 font-sans text-slate-500">Public</td>
                  <td className="p-3.5 font-sans text-slate-700">Authenticates credentials and returns JWT bearer token</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-emerald-700">POST</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/auth/register</td>
                  <td className="p-3.5 font-sans text-slate-500">Public</td>
                  <td className="p-3.5 font-sans text-slate-700">Registers student or recruiter profile</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-blue-700">GET</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/jobs</td>
                  <td className="p-3.5 font-sans text-slate-500">Public / Authenticated</td>
                  <td className="p-3.5 font-sans text-slate-700">Lists campus drives with branch/CGPA filters</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-blue-700">GET</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/jobs/&#123;id&#125;/check-eligibility/&#123;studentId&#125;</td>
                  <td className="p-3.5 font-sans text-slate-700">STUDENT, ADMIN</td>
                  <td className="p-3.5 font-sans text-slate-700">Executes automated CGPA/backlog/branch eligibility rules</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-emerald-700">POST</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/jobs</td>
                  <td className="p-3.5 font-sans text-indigo-700 font-semibold">RECRUITER, ADMIN</td>
                  <td className="p-3.5 font-sans text-slate-700">Creates new recruitment opportunity with eligibility cut-offs</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-emerald-700">POST</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/applications/apply</td>
                  <td className="p-3.5 font-sans text-blue-700 font-semibold">STUDENT</td>
                  <td className="p-3.5 font-sans text-slate-700">Submits application after automated eligibility validation</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-amber-700">PATCH</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/applications/&#123;id&#125;/status</td>
                  <td className="p-3.5 font-sans text-indigo-700 font-semibold">RECRUITER, ADMIN</td>
                  <td className="p-3.5 font-sans text-slate-700">Transitions candidate through interview rounds or offers</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-blue-700">GET</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/admin/stats</td>
                  <td className="p-3.5 font-sans text-emerald-800 font-semibold">ADMIN</td>
                  <td className="p-3.5 font-sans text-slate-700">Aggregates placement percentages, CTC brackets, and charts</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-amber-700">PATCH</td>
                  <td className="p-3.5 font-bold text-slate-900">/api/admin/students/&#123;id&#125;/verify</td>
                  <td className="p-3.5 font-sans text-emerald-800 font-semibold">ADMIN</td>
                  <td className="p-3.5 font-sans text-slate-700">Approves or revokes student academic record verification</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
