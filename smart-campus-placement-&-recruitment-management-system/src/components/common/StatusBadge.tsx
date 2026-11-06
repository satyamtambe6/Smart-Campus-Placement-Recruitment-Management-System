import React from 'react';
import { ApplicationStatus } from '../../types';

interface StatusBadgeProps {
  status: ApplicationStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configMap: Record<ApplicationStatus, { label: string; bg: string; text: string; border: string }> = {
    APPLIED: {
      label: 'Applied',
      bg: 'bg-slate-50',
      text: 'text-slate-700',
      border: 'border-slate-300',
    },
    SHORTLISTED: {
      label: 'Shortlisted',
      bg: 'bg-sky-50',
      text: 'text-sky-800',
      border: 'border-sky-300',
    },
    TECHNICAL_ROUND: {
      label: 'Technical Round',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-300',
    },
    HR_ROUND: {
      label: 'HR Round',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-300',
    },
    OFFERED: {
      label: 'Offered / Placed',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-400',
    },
    REJECTED: {
      label: 'Not Selected',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-300',
    },
  };

  const current = configMap[status] || configMap.APPLIED;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${current.bg} ${current.text} ${current.border} ${padding} whitespace-nowrap`}
    >
      {current.label}
    </span>
  );
};
