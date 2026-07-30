import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Send,
  CheckCircle2,
  Clock,
  DollarSign,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  X,
  FileSpreadsheet
} from 'lucide-react';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  department: string;
  monthlySalaryCNGN: number;
  walletAddress: string;
  taxStatus: 'Deductible Expense' | 'Subject to PAYE';
  payStatus: 'Paid' | 'Pending' | 'Processing';
  lastPaidDate?: string;
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    firstName: 'Chidi',
    lastName: 'Okonkwo',
    email: 'chidi.okonkwo@payline.io',
    phoneNumber: '+2348031112233',
    role: 'Senior Software Engineer',
    department: 'Engineering',
    monthlySalaryCNGN: 450000,
    walletAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    taxStatus: 'Subject to PAYE',
    payStatus: 'Pending',
    lastPaidDate: 'June 28, 2026'
  },
  {
    id: 'emp-2',
    firstName: 'Amaka',
    lastName: 'Eze',
    email: 'amaka.eze@payline.io',
    phoneNumber: '+2348054445566',
    role: 'Product Manager',
    department: 'Product',
    monthlySalaryCNGN: 400000,
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    taxStatus: 'Subject to PAYE',
    payStatus: 'Pending',
    lastPaidDate: 'June 28, 2026'
  },
  {
    id: 'emp-3',
    firstName: 'Tunde',
    lastName: 'Adeleke',
    email: 'tunde.adeleke@payline.io',
    phoneNumber: '+2348127778899',
    role: 'DevOps & Infrastructure',
    department: 'Engineering',
    monthlySalaryCNGN: 480000,
    walletAddress: '0xbDA5747bfd65F08deb54cb465eB3830908BC7a50',
    taxStatus: 'Deductible Expense',
    payStatus: 'Paid',
    lastPaidDate: 'July 28, 2026'
  },
  {
    id: 'emp-4',
    firstName: 'Zainab',
    lastName: 'Bello',
    email: 'zainab.bello@payline.io',
    phoneNumber: '+2349019990011',
    role: 'Operations Lead',
    department: 'Operations',
    monthlySalaryCNGN: 350000,
    walletAddress: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    taxStatus: 'Subject to PAYE',
    payStatus: 'Pending',
    lastPaidDate: 'June 28, 2026'
  }
];

interface EmployeePayrollProps {
  onOpenAskBAI: (prompt?: string) => void;
  bmoniBalanceCNGN?: number;
}

export const EmployeePayroll: React.FC<EmployeePayrollProps> = ({ onOpenAskBAI, bmoniBalanceCNGN = 10000 }) => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // Single & Batch Payroll Processing State
  const [isProcessingBatch, setIsProcessingBatch] = useState<boolean>(false);
  const [payrollSuccessMsg, setPayrollSuccessMsg] = useState<string | null>(null);

  // New Employee Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newSalary, setNewSalary] = useState('350000');

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const totalPayrollCNGN = employees.reduce((sum, e) => sum + e.monthlySalaryCNGN, 0);
  const pendingPayrollCNGN = employees
    .filter((e) => e.payStatus === 'Pending')
    .reduce((sum, e) => sum + e.monthlySalaryCNGN, 0);

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName || !newLastName) return;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      firstName: newFirstName,
      lastName: newLastName,
      email: newEmail || `${newFirstName.toLowerCase()}.${newLastName.toLowerCase()}@payline.io`,
      phoneNumber: newPhone || '+2348000000000',
      role: newRole || 'Team Specialist',
      department: newDept,
      monthlySalaryCNGN: parseFloat(newSalary) || 300000,
      walletAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
      taxStatus: 'Subject to PAYE',
      payStatus: 'Pending',
      lastPaidDate: 'Never'
    };

    setEmployees((prev) => [newEmp, ...prev]);
    setShowAddModal(false);
    // Reset form
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewPhone('');
    setNewRole('');
  };

  const handleDisburseSinglePayroll = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, payStatus: 'Processing' } : emp))
    );

    setTimeout(() => {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === id
            ? { ...emp, payStatus: 'Paid', lastPaidDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }
            : emp
        )
      );
      setPayrollSuccessMsg(`Single payroll disbursed successfully! Wallet transfer completed.`);
      setTimeout(() => setPayrollSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleDisburseBatchPayroll = () => {
    setIsProcessingBatch(true);
    setPayrollSuccessMsg(null);

    setTimeout(() => {
      setEmployees((prev) =>
        prev.map((emp) => ({
          ...emp,
          payStatus: 'Paid',
          lastPaidDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        }))
      );
      setIsProcessingBatch(false);
      setPayrollSuccessMsg(`Batch Payroll Completed! Disbursed ₦${pendingPayrollCNGN.toLocaleString()} CNGN across ${employees.length} employees via BMoni API.`);
      setTimeout(() => setPayrollSuccessMsg(null), 5000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Payroll Summary */}
      <div className="bg-white rounded-[24px] p-6 shadow-xs border border-[#E5E5EA]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center font-bold shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-[#1C1C1E]">Employee Payroll & Onboarding</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  BMoni Wallet Rail Active
                </span>
              </div>
              <p className="text-xs text-[#8E8E93]">
                Manage team compensation, onboarding cards, and batch payroll disbursement
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenAskBAI('Analyze our monthly payroll budget and optimize tax deductible components.')}
              className="px-4 py-2.5 bg-[#F5F5F7] hover:bg-[#E5E5EA] text-[#3B1053] text-xs font-bold rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
              <span>Payroll AI Advice</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-2.5 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] text-xs font-extrabold rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Employee</span>
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-[#E5E5EA]">
            <span className="text-[11px] text-[#8E8E93] font-semibold block">Total Monthly Payroll</span>
            <span className="text-2xl font-black text-[#1C1C1E]">₦{totalPayrollCNGN.toLocaleString()} CNGN</span>
            <span className="text-[10px] text-[#8E8E93] block mt-1">{employees.length} Active Employees</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-[#E5E5EA]">
            <span className="text-[11px] text-[#8E8E93] font-semibold block">Pending Disbursal</span>
            <span className="text-2xl font-black text-amber-600">₦{pendingPayrollCNGN.toLocaleString()} CNGN</span>
            <span className="text-[10px] text-amber-700 block mt-1">
              {employees.filter((e) => e.payStatus === 'Pending').length} Pending Payrolls
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-[#E5E5EA] flex flex-col justify-between">
            <div>
              <span className="text-[11px] text-[#8E8E93] font-semibold block">Batch Action</span>
              <span className="text-xs font-bold text-[#1C1C1E]">Disburse all pending salaries</span>
            </div>

            <button
              onClick={handleDisburseBatchPayroll}
              disabled={isProcessingBatch || pendingPayrollCNGN === 0}
              className="mt-2 w-full py-2 bg-[#1C1C1E] hover:bg-[#3B1053] text-white disabled:opacity-50 text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              {isProcessingBatch ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#DFFF4F]" />
                  <span>Processing Batch Payroll...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#DFFF4F]" />
                  <span>Execute 1-Click Batch Payroll</span>
                </>
              )}
            </button>
          </div>
        </div>

        {payrollSuccessMsg && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{payrollSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Directory & Cards */}
      <div className="bg-white rounded-[24px] p-6 shadow-xs border border-[#E5E5EA]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
          <h3 className="text-lg font-extrabold text-[#1C1C1E]">Employee Directory</h3>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input
                type="text"
                placeholder="Search employee or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-medium"
              />
            </div>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-bold text-[#1C1C1E]"
            >
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>

        {/* Employee Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="p-5 rounded-2xl bg-[#F9F9FB] border border-[#E5E5EA] hover:border-[#3B1053]/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#3B1053] to-[#8B5CF6] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {emp.firstName[0]}
                    {emp.lastName[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-[#1C1C1E]">
                      {emp.firstName} {emp.lastName}
                    </h4>
                    <span className="text-xs text-[#8E8E93] font-medium">{emp.role}</span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    emp.payStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : emp.payStatus === 'Processing'
                      ? 'bg-blue-100 text-blue-800 animate-pulse'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {emp.payStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-[#E5E5EA]">
                <div>
                  <span className="text-[10px] text-[#8E8E93] block font-medium">Monthly Salary</span>
                  <span className="font-extrabold text-[#1C1C1E]">₦{emp.monthlySalaryCNGN.toLocaleString()} CNGN</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#8E8E93] block font-medium">Tax Tag</span>
                  <span className="font-bold text-indigo-700">{emp.taxStatus}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-[#8E8E93]">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  <span>{emp.phoneNumber}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5EA] flex items-center justify-between">
                <span className="text-[10px] text-[#8E8E93]">Last Paid: {emp.lastPaidDate || 'N/A'}</span>

                <button
                  onClick={() => handleDisburseSinglePayroll(emp.id)}
                  disabled={emp.payStatus === 'Paid' || emp.payStatus === 'Processing'}
                  className="px-3.5 py-1.5 bg-[#3B1053] hover:bg-[#2F0B43] text-[#DFFF4F] disabled:bg-[#E5E5EA] disabled:text-[#8E8E93] text-xs font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  {emp.payStatus === 'Paid' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Salary Paid</span>
                    </>
                  ) : emp.payStatus === 'Processing' ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Pay Salary Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] p-6 max-w-md w-full shadow-2xl relative space-y-4 border border-[#E5E5EA]">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F5F5F7] hover:bg-[#E5E5EA] flex items-center justify-center text-[#1C1C1E] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3B1053] text-[#DFFF4F] flex items-center justify-center font-bold">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-[#1C1C1E]">Onboard New Employee</h3>
                <p className="text-xs text-[#8E8E93]">Auto-generates BMoni Smart Wallet recipient</p>
              </div>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Michael"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Onuoha"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="employee@payline.io"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+2349138663979"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">Role Title</label>
                  <input
                    type="text"
                    placeholder="Software Architect"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-medium"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-bold"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product">Product</option>
                    <option value="Operations">Operations</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#1C1C1E] block mb-1">Monthly Salary (CNGN)</label>
                <input
                  type="number"
                  placeholder="450000"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F5F7] rounded-xl text-xs outline-none border border-[#E5E5EA] font-bold text-[#3B1053]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#F5F5F7] text-[#1C1C1E] text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B1053] text-[#DFFF4F] text-xs font-extrabold rounded-xl hover:bg-[#2F0B43]"
                >
                  Confirm Onboarding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
