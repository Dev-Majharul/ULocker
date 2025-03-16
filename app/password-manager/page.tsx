"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, Lock, Shield, Key, Copy, Eye, EyeOff, Plus, Search, CreditCard, ArrowUpRight, Trash2, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { generatePassword, calculatePasswordStrength, getPasswordStrengthText } from '@/lib/utils';
import CryptoJS from 'crypto-js';

export default function PasswordManager() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(tabParam || 'passwords');
  const [showMasterKeyModal, setShowMasterKeyModal] = useState(true);
  const [masterKey, setMasterKey] = useState('');
  const [verified, setVerified] = useState(false);
  const [showPassword, setShowPassword] = useState<{[key: string]: boolean}>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Password generator state
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthInfo, setStrengthInfo] = useState({ text: '', color: '' });

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam && ['passwords', 'generate', 'cards', 'autofill'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Generate password on initial load and when settings change
  useEffect(() => {
    if (activeTab === 'generate') {
      createNewPassword();
    }
  }, [activeTab, passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    router.push(`/password-manager?tab=${tab}`, { scroll: false });
  };

  // Create a new password based on current settings
  const createNewPassword = () => {
    const newPassword = generatePassword(
      passwordLength,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSymbols
    );
    
    setGeneratedPassword(newPassword);
    
    // Calculate strength
    const strength = calculatePasswordStrength(newPassword);
    setStrengthScore(strength);
    
    // Get text description
    const strengthTextInfo = getPasswordStrengthText(strength);
    setStrengthInfo(strengthTextInfo);
    
    // If the password is weak, display a security warning
    if (strength < 40) {
      setSecurityAlert({
        message: "This password isn't very strong. Consider adding more length or complexity.",
        level: "warning"
      });
    } else {
      setSecurityAlert(null);
    }
  };

  // Save the generated password to the vault
  const saveNewPassword = () => {
    if (!verified || !masterKey) {
      setShowMasterKeyModal(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Create the password object
      const passwordData = {
        id: crypto.randomUUID(), // Generate a unique ID
        site: 'example.com',
        username: 'new_user',
        password: generatedPassword,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      
      // Encrypt the password data with the master key
      const encryptedData = encryptData(passwordData, masterKey);
      
      if (!encryptedData) {
        throw new Error("Failed to encrypt password data");
      }
      
      // Here you would save the encrypted data to your storage
      // For example, to localStorage (not recommended for production)
      const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
      savedPasswords.push({
        id: passwordData.id,
        url: passwordData.site, // Store URL unencrypted for display purposes
        username: maskCredential(passwordData.username), // Store masked username for display
        encryptedData // Store the fully encrypted data
      });
      
      localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
      
      // Reset form and show success message
      setGeneratedPassword('');
      setStrengthScore(0);
      setStrengthInfo({ text: '', color: '' });
      setSecurityAlert(null);
      
      // Log the security event (without the actual password)
      console.log(`[SECURITY] Password saved for ${passwordData.site}`);
      
    } catch (error) {
      console.error('Error saving password:', error);
      setErrorMessage('Failed to save password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Mock data - in real implementation this would come from a secure database
  const [passwords, setPasswords] = useState([
    { id: '1', site: 'github.com', username: 'cyberpunk_dev', password: 'Str0ngP@ss!', lastUpdated: '2023-05-15' },
    { id: '2', site: 'netflix.com', username: 'neon_watcher', password: 'Net@2023!', lastUpdated: '2023-04-10' },
    { id: '3', site: 'gmail.com', username: 'cyber.hacker', password: 'G00gl3P@ss!', lastUpdated: '2023-06-20' },
  ]);

  const [cards, setCards] = useState([
    { id: '1', name: 'Cyber Bank', cardNumber: '**** **** **** 4321', expiryDate: '05/25', cardHolder: 'JOHN MATRIX' },
    { id: '2', name: 'Neon Credit', cardNumber: '**** **** **** 8765', expiryDate: '11/24', cardHolder: 'JOHN MATRIX' },
  ]);

  // Verify master key - in real app, this would involve proper cryptographic verification
  const verifyMasterKey = () => {
    setLoading(true);
    // Simulate verification delay
    setTimeout(() => {
      // Demo purposes only - real implementation would use secure comparison
      if (masterKey.length >= 6) {
        setVerified(true);
        setShowMasterKeyModal(false);
      } else {
        alert('Invalid master key. Please try again.');
      }
      setLoading(false);
    }, 1500);
  };

  // Filter passwords based on search term
  const filteredPasswords = passwords.filter(
    pwd => pwd.site.toLowerCase().includes(searchTerm.toLowerCase()) || 
           pwd.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setShowPassword(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const encryptData = (data: any, masterKey: string) => {
    try {
      // Use the master key to encrypt the data with AES
      return CryptoJS.AES.encrypt(JSON.stringify(data), masterKey).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  };

  const decryptData = (encryptedData: string, masterKey: string) => {
    try {
      // Decrypt the data using the master key
      const bytes = CryptoJS.AES.decrypt(encryptedData, masterKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  };

  if (showMasterKeyModal) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="relative w-full max-w-md p-8 mx-auto bg-black/90 border-2 border-cyan-500 rounded-lg shadow-2xl shadow-cyan-500/20 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
            <div className="absolute inset-0 grid grid-cols-12 gap-0.5">
              {Array.from({ length: 200 }).map((_, i) => (
                <div 
                  key={i} 
                  className="h-[1px] w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" 
                  style={{ 
                    transform: `translateY(${Math.random() * 1000}px)`,
                    opacity: Math.random(),
                    animationDelay: `${Math.random() * 5}s`,
                    animationDuration: `${3 + Math.random() * 5}s`
                  }}
                />
              ))}
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-cyan-500" />
            </div>
            <h2 className="mb-6 text-2xl font-bold text-center cyberpunk-text animate-pulse">SECURE ACCESS REQUIRED</h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  className="w-full px-4 py-3 text-lg bg-black/50 border-2 border-cyan-500 rounded-md outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300"
                  placeholder="Enter Master Key"
                  onKeyDown={(e) => e.key === 'Enter' && verifyMasterKey()}
                />
                <Lock className="absolute top-3.5 right-3 h-5 w-5 text-cyan-500" />
              </div>
              <Button
                onClick={verifyMasterKey}
                disabled={loading}
                className="w-full px-4 py-6 text-lg font-bold text-black bg-gradient-to-r from-cyan-400 to-pink-500 rounded-md hover:from-pink-500 hover:to-cyan-400 transition-all duration-500 shadow-lg shadow-cyan-500/30 hover:shadow-pink-500/30"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Key className="w-5 h-5 mr-2" />
                )}
                AUTHENTICATE
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">SECURE VAULT</span>
            </h1>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-pink-500 border-pink-500 hover:bg-pink-500/20"
              >
                <RefreshCw className="w-4 h-4" />
                SYNC
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowMasterKeyModal(true)}
                className="flex items-center gap-2 text-cyan-500 border-cyan-500 hover:bg-cyan-500/20"
              >
                <Lock className="w-4 h-4" />
                LOCK
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Button
              onClick={() => handleTabChange('passwords')}
              className={`flex items-center justify-center gap-2 p-4 transition-all duration-300 ${
                activeTab === 'passwords' 
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold shadow-lg shadow-cyan-500/30' 
                  : 'bg-black/50 border border-cyan-500 hover:bg-cyan-500/20'
              }`}
            >
              <Database className="w-4 h-4" />
              SAVED PASSWORDS
            </Button>
            <Button
              onClick={() => handleTabChange('generate')}
              className={`flex items-center justify-center gap-2 p-4 transition-all duration-300 ${
                activeTab === 'generate' 
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold shadow-lg shadow-cyan-500/30' 
                  : 'bg-black/50 border border-cyan-500 hover:bg-cyan-500/20'
              }`}
            >
              <Key className="w-4 h-4" />
              GENERATE PASSWORD
            </Button>
            <Button
              onClick={() => handleTabChange('cards')}
              className={`flex items-center justify-center gap-2 p-4 transition-all duration-300 ${
                activeTab === 'cards' 
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold shadow-lg shadow-cyan-500/30' 
                  : 'bg-black/50 border border-cyan-500 hover:bg-cyan-500/20'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              SAVED CARDS
            </Button>
            <Button
              onClick={() => handleTabChange('autofill')}
              className={`flex items-center justify-center gap-2 p-4 transition-all duration-300 ${
                activeTab === 'autofill' 
                  ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-black font-bold shadow-lg shadow-cyan-500/30' 
                  : 'bg-black/50 border border-cyan-500 hover:bg-cyan-500/20'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              AUTO-FILL SETTINGS
            </Button>
          </div>

          {activeTab === 'passwords' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="relative w-full max-w-md">
                  <input
                    type="text"
                    placeholder="Search passwords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border-2 border-cyan-500 rounded-md focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 transition-all duration-300"
                  />
                  <Search className="absolute top-2.5 left-3 h-5 w-5 text-cyan-500" />
                </div>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold hover:from-pink-500 hover:to-cyan-400 shadow-lg shadow-pink-500/20">
                  <Plus className="w-4 h-4" />
                  ADD NEW
                </Button>
              </div>

              <div className="overflow-hidden border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
                <table className="w-full text-left">
                  <thead className="bg-gradient-to-r from-cyan-500/20 to-pink-500/20">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Site</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Username</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Password</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Last Updated</th>
                      <th className="px-6 py-3 text-xs font-medium tracking-wider text-cyan-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-500/30">
                    {filteredPasswords.length > 0 ? (
                      filteredPasswords.map((pwd) => (
                        <tr key={pwd.id} className="bg-black hover:bg-cyan-950/30 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">{pwd.site}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {pwd.username}
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyToClipboard(pwd.username)}
                                className="p-1 hover:bg-cyan-500/20"
                              >
                                <Copy className="w-3 h-3 text-cyan-500" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono">{showPassword[pwd.id] ? pwd.password : '••••••••••'}</span>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => togglePasswordVisibility(pwd.id)}
                                className="p-1 hover:bg-cyan-500/20"
                              >
                                {showPassword[pwd.id] ? 
                                  <EyeOff className="w-3 h-3 text-pink-500" /> : 
                                  <Eye className="w-3 h-3 text-cyan-500" />
                                }
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => copyToClipboard(pwd.password)}
                                className="p-1 hover:bg-cyan-500/20"
                              >
                                <Copy className="w-3 h-3 text-cyan-500" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">{pwd.lastUpdated}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" className="p-1 hover:bg-pink-500/20">
                                <Trash2 className="w-4 h-4 text-pink-500" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                          No passwords match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'generate' && (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
              <h2 className="mb-6 text-2xl font-bold text-center cyberpunk-text">PASSWORD GENERATOR</h2>
              
              <div className="space-y-6">
                <div className="p-4 font-mono text-lg text-center bg-black border-2 border-pink-500 rounded-lg">
                  {generatedPassword}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    onClick={() => copyToClipboard(generatedPassword)}
                    className="w-full p-4 font-bold text-black bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-pink-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/30"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    COPY PASSWORD
                  </Button>
                  <Button 
                    onClick={createNewPassword}
                    className="w-full p-4 font-bold text-black bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-pink-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/30"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    GENERATE NEW
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Password Strength</span>
                    <span className={`text-sm font-bold ${strengthInfo.color}`}>{strengthInfo.text}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        strengthScore >= 80 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                        strengthScore >= 60 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' :
                        strengthScore >= 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                        strengthScore >= 20 ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                        'bg-gradient-to-r from-red-500 to-red-400'
                      }`} 
                      style={{ width: `${strengthScore}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium">PASSWORD LENGTH: {passwordLength}</label>
                    <input 
                      type="range" 
                      min="8" 
                      max="32" 
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>8</span>
                      <span>16</span>
                      <span>24</span>
                      <span>32</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="uppercase"
                        checked={includeUppercase}
                        onChange={() => setIncludeUppercase(!includeUppercase)}
                        className="w-4 h-4 accent-cyan-500" 
                      />
                      <label htmlFor="uppercase" className="ml-2 text-sm">Uppercase Letters</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="lowercase"
                        checked={includeLowercase}
                        onChange={() => setIncludeLowercase(!includeLowercase)}
                        className="w-4 h-4 accent-cyan-500" 
                      />
                      <label htmlFor="lowercase" className="ml-2 text-sm">Lowercase Letters</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="numbers"
                        checked={includeNumbers}
                        onChange={() => setIncludeNumbers(!includeNumbers)}
                        className="w-4 h-4 accent-cyan-500" 
                      />
                      <label htmlFor="numbers" className="ml-2 text-sm">Numbers</label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="symbols"
                        checked={includeSymbols}
                        onChange={() => setIncludeSymbols(!includeSymbols)}
                        className="w-4 h-4 accent-cyan-500" 
                      />
                      <label htmlFor="symbols" className="ml-2 text-sm">Special Characters</label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={saveNewPassword}
                  className="w-full p-4 font-bold text-black bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-pink-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/30"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  SAVE TO VAULT
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'cards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold cyberpunk-text">SAVED PAYMENT CARDS</h2>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-pink-500 text-black font-bold hover:from-pink-500 hover:to-cyan-400 shadow-lg shadow-pink-500/20">
                  <Plus className="w-4 h-4" />
                  ADD NEW CARD
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => (
                  <div 
                    key={card.id} 
                    className="relative p-6 overflow-hidden bg-gradient-to-br from-cyan-950 to-pink-950 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20 h-48"
                  >
                    {/* Holographic effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent animate-pulse"></div>
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      <div className="flex justify-between">
                        <span className="font-bold text-cyan-500">{card.name}</span>
                        <CreditCard className="w-6 h-6 text-pink-500" />
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <div className="font-mono text-lg tracking-wider">{card.cardNumber}</div>
                        <div className="flex justify-between">
                          <div>
                            <div className="text-xs text-gray-400">EXPIRES</div>
                            <div>{card.expiryDate}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-400">CARDHOLDER</div>
                            <div>{card.cardHolder}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        <Button size="sm" variant="ghost" className="p-1 hover:bg-cyan-500/20">
                          <Copy className="w-4 h-4 text-cyan-500" />
                        </Button>
                        <Button size="sm" variant="ghost" className="p-1 hover:bg-pink-500/20">
                          <Trash2 className="w-4 h-4 text-pink-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'autofill' && (
            <div className="max-w-2xl mx-auto mt-8 p-6 bg-black/70 border-2 border-cyan-500 rounded-lg shadow-lg shadow-cyan-500/20">
              <h2 className="mb-6 text-2xl font-bold text-center cyberpunk-text">AUTO-FILL SETTINGS</h2>
              
              <div className="space-y-6">
                <div className="p-4 border border-cyan-500/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-cyan-500" />
                      <span className="font-medium">Auto-fill on recognized sites</span>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition-colors focus:outline-none">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-cyan-500 translate-x-6 transition-transform"></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-cyan-500/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-cyan-500" />
                      <span className="font-medium">Require authentication for auto-fill</span>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition-colors focus:outline-none">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-cyan-500 translate-x-6 transition-transform"></span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-cyan-500/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-cyan-500" />
                      <span className="font-medium">Auto-fill payment details</span>
                    </div>
                    <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition-colors focus:outline-none">
                      <span className="inline-block h-4 w-4 transform rounded-full bg-cyan-500 translate-x-1 transition-transform"></span>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full p-4 font-bold text-black bg-gradient-to-r from-cyan-400 to-pink-500 hover:from-pink-500 hover:to-cyan-400 shadow-lg shadow-cyan-500/30">
                  SAVE SETTINGS
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 