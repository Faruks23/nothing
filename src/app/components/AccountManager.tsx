'use client';

import { useState, useEffect } from 'react';
import { PlusCircle, LogIn, Trash2, Search, Filter, SortAsc, SortDesc } from 'lucide-react';

type Account = {
  id: string;
  email: string;
  password: string;
};

export default function AccountManager() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [newAccount, setNewAccount] = useState<Account>({ id: '', email: '', password: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) setAccounts(JSON.parse(storedAccounts));
  }, []);

  const addAccount = () => {
    if (!newAccount.email || !newAccount.password) {
      alert('Please fill in all fields.');
      return;
    }
    const updatedAccounts = [...accounts, { ...newAccount, id: `${Date.now()}` }];
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setNewAccount({ id: '', email: '', password: '' });
  };

  const loginAccount = async (account: Account) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });
      const result = await response.json();
      if (result.success) alert('Login successful!');
      else alert('Login failed.');
    } catch (error) {
      alert('An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = (id: string) => {
    const updatedAccounts = accounts.filter(account => account.id !== id);
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
  };

  const filteredAndSortedAccounts = accounts
    .filter(account => account.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.email.localeCompare(b.email);
      } else {
        return b.email.localeCompare(a.email);
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
      
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Add Account Form */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Account</h2>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={newAccount.email}
                onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={newAccount.password}
                onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                onClick={addAccount}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Account
              </button>
            </div>
          </div>

          {/* Right side - Account List with Search, Filter, and Sort */}
          <div className="lg:w-2/3 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Saved Accounts</h2>
            <div className="mb-4 flex items-center space-x-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search accounts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-5 w-5" /> : <SortDesc className="h-5 w-5" />}
              </button>
            </div>
            <ul className="divide-y divide-gray-200">
              {filteredAndSortedAccounts.map((account) => (
                <li key={account.id} className="py-4 flex flex-col gap-5 md:flex-row items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">{account.email}</p>
                  <p className="text-sm font-medium text-gray-900">{account.password}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => loginAccount(account)}
                      disabled={isLoading}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                    <button
                      onClick={() => deleteAccount(account.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:border-indigo-300 focus:shadow-outline-indigo active:bg-indigo-200 transition ease-in-out duration-150"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
       
      </div>
    </div>
  );
}

