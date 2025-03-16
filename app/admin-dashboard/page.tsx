"use client";

import React, { useState, useEffect } from 'react';
import { Shield, User, Users, Activity, Clock, AlertTriangle, Lock, Key, Database, Eye, RefreshCw, Server, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'overview');
  const router = useRouter();

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['overview', 'users', 'security'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/admin-dashboard?tab=${tab}`, { scroll: false });
  };

  // Mock data for admin dashboard
  const stats = [
    { name: 'Total Users', value: '1,248', icon: Users, color: 'cyan' },
    { name: 'Active Vaults', value: '892', icon: Shield, color: 'pink' },
    { name: 'Failed Attempts', value: '24', icon: AlertTriangle, color: 'yellow' },
    { name: 'Avg. Response', value: '42ms', icon: Clock, color: 'green' },
  ];

  const recentActivity = [
    { id: 1, user: 'user384', action: 'Password Updated', target: 'netflix.com', time: '12 min ago' },
    { id: 2, user: 'jane_doe', action: 'New Card Added', target: 'Visa ****4392', time: '27 min ago' },
    { id: 3, user: 'cyber_admin', action: 'Settings Changed', target: 'Security Settings', time: '1 hour ago' },
    { id: 4, user: 'matrix_user', action: 'Failed Login', target: 'IP: 192.168.1.34', time: '2 hours ago' },
    { id: 5, user: 'neo_hacker', action: 'Password Generated', target: '16 characters', time: '3 hours ago' },
  ];

  const users = [
    { id: 1, username: 'admin_user', email: 'admin@secvault.com', role: 'Admin', lastLogin: '14 min ago', status: 'Active' },
    { id: 2, username: 'jane_doe', email: 'jane@example.com', role: 'User', lastLogin: '2 hours ago', status: 'Active' },
    { id: 3, username: 'john_smith', email: 'john@example.com', role: 'User', lastLogin: '1 day ago', status: 'Inactive' },
    { id: 4, username: 'matrix_user', email: 'matrix@example.com', role: 'User', lastLogin: '3 days ago', status: 'Active' },
    { id: 5, username: 'cyber_punk', email: 'cyber@example.com', role: 'Moderator', lastLogin: '5 hours ago', status: 'Active' },
  ];

  const securityAlerts = [
    { id: 1, level: 'High', message: 'Multiple failed login attempts detected', time: '18 min ago' },
    { id: 2, level: 'Medium', message: 'Unusual login location detected', time: '3 hours ago' },
    { id: 3, level: 'Low', message: 'Password expiring for 3 users', time: '2 days ago' },
  ];

  return (
    <div className="container p-4 mx-auto">
      <div className="relative w-full p-6 overflow-hidden bg-black/90 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/20 min-h-[calc(100vh-160px)]">
        {/* Cyberpunk grid lines background effect */}
        <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
          <div className="absolute inset-0 grid grid-cols-24 gap-0.5">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="h-full w-[1px] bg-cyan-500" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-24 gap-0.5">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-pink-500" />
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold cyberpunk-text">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">ADMIN CONTROL CENTER</span>
            </h1>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-pink-500 border-pink-500 hover:bg-pink-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                SYNC DATA
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-cyan-500 border-cyan-500 hover:bg-cyan-500/20"
              >
                <Server className="w-4 h-4" />
                SYSTEM STATUS
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const IconComponent = stat.icon;
              return (
                <div key={idx} className="p-4 bg-black/50 border-2 border-cyan-500 rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-shadow duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-400">{stat.name}</p>
                      <p className={`text-2xl font-bold cyberpunk-text text-${stat.color}-500`}>{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full bg-${stat.color}-500/20`}>
                      <IconComponent className={`h-6 w-6 text-${stat.color}-500`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Button
              onClick={() => handleTabChange('overview')}
              className={`flex items-center justify-center gap-2 p-4 transition-all duration-300 ${
                activeTab === 'overview' 
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold shadow-lg shadow-cyan-500/30' 
                  : 'bg-black/50 border border-cyan-500 hover:bg-cyan-500/20'
              }`}
            >
              <Activity className="w-4 h-4" />
              SYSTEM OVERVIEW
            </Button>
            <Button
              onClick={() => handleTabChange('users')}
              className={`flex items-center justify-center gap-2 p-4 transition-all duration-300 ${
                activeTab === 'users' 
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold shadow-lg shadow-cyan-500/30' 
                  : 'bg-black/50 border border-cyan-500 hover:bg-cyan-500/20'
              }`}
            >
              <Users className="w-4 h-4" />
              USER MANAGEMENT
            </Button>
            <Button
              onClick={() => handleTabChange('security')}
              className={`flex items-center justify-center gap-2 p-4 transition-all duration-300 ${
                activeTab === 'security' 
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold shadow-lg shadow-cyan-500/30' 
                  : 'bg-black/50 border border-cyan-500 hover:bg-cyan-500/20'
              }`}
            >
              <Shield className="w-4 h-4" />
              SECURITY CENTER
            </Button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="overflow-hidden border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                <div className="p-4 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-pink-500/20">
                  <h2 className="text-lg font-bold cyberpunk-text">RECENT ACTIVITY</h2>
                </div>
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase bg-black/70">
                    <tr>
                      <th className="px-6 py-3 text-left text-cyan-500">User</th>
                      <th className="px-6 py-3 text-left text-cyan-500">Action</th>
                      <th className="px-6 py-3 text-left text-cyan-500">Target</th>
                      <th className="px-6 py-3 text-left text-cyan-500">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/30">
                    {recentActivity.map((activity) => (
                      <tr key={activity.id} className="bg-black hover:bg-cyan-950/30 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{activity.user}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{activity.action}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{activity.target}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">{activity.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                  <h2 className="mb-4 text-lg font-bold cyberpunk-text">SYSTEM HEALTH</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Database</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>API Gateway</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Authentication Service</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500" style={{ width: '98%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Encryption Engine</span>
                        <span className="text-green-500">Operational</span>
                      </div>
                      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-green-500" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                  <h2 className="mb-4 text-lg font-bold cyberpunk-text">SECURITY ALERTS</h2>
                  <div className="space-y-4">
                    {securityAlerts.map((alert) => (
                      <div key={alert.id} className="p-4 bg-black/80 border border-cyan-500/50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className={`p-1.5 rounded-full ${
                              alert.level === 'High' ? 'bg-red-500/20' : 
                              alert.level === 'Medium' ? 'bg-yellow-500/20' : 'bg-green-500/20'
                            } mr-3`}>
                              <AlertTriangle className={`h-4 w-4 ${
                                alert.level === 'High' ? 'text-red-500' : 
                                alert.level === 'Medium' ? 'text-yellow-500' : 'text-green-500'
                              }`} />
                            </div>
                            <div>
                              <p className="font-medium">{alert.message}</p>
                              <p className="text-xs text-gray-400">{alert.time}</p>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            alert.level === 'High' ? 'bg-red-500/20 text-red-500' : 
                            alert.level === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'
                          }`}>
                            {alert.level}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border-2 border-cyan-500 rounded-md focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300"
                  />
                  <Search className="absolute top-2.5 left-3 h-5 w-5 text-cyan-500" />
                </div>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold hover:from-pink-500 hover:to-cyan-400 shadow-lg shadow-pink-500/20">
                  <User className="w-4 h-4" />
                  ADD NEW USER
                </Button>
              </div>

              <div className="overflow-hidden border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Last Login</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/30">
                    {users.map((user) => (
                      <tr key={user.id} className="bg-black hover:bg-cyan-950/30 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.role === 'Admin' ? 'bg-pink-500/20 text-pink-500' : 
                            user.role === 'Moderator' ? 'bg-purple-500/20 text-purple-500' : 'bg-cyan-500/20 text-cyan-500'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-400">{user.lastLogin}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.status === 'Active' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost" className="p-1 text-cyan-500 hover:bg-cyan-500/20">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-1 text-pink-500 hover:bg-pink-500/20">
                              <Key className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                  <h2 className="mb-4 text-lg font-bold cyberpunk-text">SECURITY SETTINGS</h2>
                  
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Master Key Rotation Policy</label>
                      <select className="w-full p-2 bg-black border-2 border-cyan-500 rounded-md focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50">
                        <option>Every 30 days (Recommended)</option>
                        <option>Every 60 days</option>
                        <option>Every 90 days</option>
                        <option>Manual Rotation</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-cyan-500/50 rounded-lg">
                      <div className="flex items-center">
                        <Lock className="w-5 h-5 text-cyan-500 mr-3" />
                        <span>Two-factor authentication</span>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition-colors focus:outline-none">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-cyan-500 translate-x-6 transition-transform"></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-cyan-500/50 rounded-lg">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-cyan-500 mr-3" />
                        <span>Notify on suspicious login attempts</span>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition-colors focus:outline-none">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-cyan-500 translate-x-6 transition-transform"></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-cyan-500/50 rounded-lg">
                      <div className="flex items-center">
                        <Database className="w-5 h-5 text-cyan-500 mr-3" />
                        <span>Encrypt backups</span>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition-colors focus:outline-none">
                        <span className="inline-block h-4 w-4 transform rounded-full bg-cyan-500 translate-x-6 transition-transform"></span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-4 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold hover:from-pink-500 hover:to-cyan-400">
                      SAVE SECURITY SETTINGS
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                  <h2 className="mb-4 text-lg font-bold cyberpunk-text">ACCESS LOGS</h2>
                  
                  <div className="overflow-hidden border border-cyan-500/50 rounded-lg max-h-[400px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase bg-black sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left text-cyan-500">Time</th>
                          <th className="px-4 py-2 text-left text-cyan-500">User</th>
                          <th className="px-4 py-2 text-left text-cyan-500">IP Address</th>
                          <th className="px-4 py-2 text-left text-cyan-500">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-cyan-500/20">
                        {[...Array(10)].map((_, i) => (
                          <tr key={i} className="bg-black hover:bg-cyan-950/30">
                            <td className="px-4 py-2 text-xs text-gray-400">{i % 2 === 0 ? '10 min ago' : i % 3 === 0 ? '2 hours ago' : '5 hours ago'}</td>
                            <td className="px-4 py-2">user{(Math.random() * 1000).toFixed(0)}</td>
                            <td className="px-4 py-2 font-mono text-xs">192.168.{Math.floor(Math.random() * 255)}.{Math.floor(Math.random() * 255)}</td>
                            <td className="px-4 py-2">
                              <span className={`px-1.5 py-0.5 text-xs rounded-full ${Math.random() > 0.2 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                {Math.random() > 0.2 ? 'Success' : 'Failed'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <Button className="w-full mt-4 border border-cyan-500 text-cyan-500 hover:bg-cyan-500/20">
                    VIEW FULL LOG HISTORY
                  </Button>
                </div>
              </div>
              
              <div className="p-6 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                <h2 className="mb-4 text-lg font-bold cyberpunk-text">ENCRYPTION SETTINGS</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Encryption Algorithm</label>
                    <select className="w-full p-2 bg-black border-2 border-cyan-500 rounded-md focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50">
                      <option>AES-256-GCM (Recommended)</option>
                      <option>ChaCha20-Poly1305</option>
                      <option>Twofish-256</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Key Derivation Function</label>
                    <select className="w-full p-2 bg-black border-2 border-cyan-500 rounded-md focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50">
                      <option>Argon2id (Recommended)</option>
                      <option>PBKDF2</option>
                      <option>Scrypt</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Memory Cost</label>
                    <input 
                      type="range" 
                      min="64" 
                      max="1024" 
                      step="64" 
                      defaultValue="256" 
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs">
                      <span>64 MB</span>
                      <span>256 MB</span>
                      <span>1024 MB</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Iterations</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      defaultValue="3" 
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs">
                      <span>1 (Faster)</span>
                      <span>3</span>
                      <span>10 (Stronger)</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-pink-500/10 border border-pink-500 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="w-5 h-5 text-pink-500 mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-pink-500">Warning: Changing encryption settings</p>
                      <p className="text-sm text-gray-400">Changing these settings will require re-encryption of all stored data. This process may take time depending on the amount of data stored.</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold hover:from-pink-500 hover:to-cyan-400">
                  APPLY ENCRYPTION SETTINGS
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 