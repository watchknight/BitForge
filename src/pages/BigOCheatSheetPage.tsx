import React, { useState } from 'react';
import { complexityEntries, getComplexityBadgeClass } from '../data/bigOData';
import { 
  Table, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Info, 
  TrendingUp,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface BigOCheatSheetPageProps {
  onSelectTopic: (topicId: string) => void;
}

export const BigOCheatSheetPage: React.FC<BigOCheatSheetPageProps> = ({
  onSelectTopic,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<'name' | 'category'>('category');
  const [sortAsc, setSortAsc] = useState(true);

  const categories = ['all', 'Data Structure', 'Sorting', 'Searching', 'Graph', 'Dynamic Programming', 'Greedy', 'Advanced'];

  const filtered = complexityEntries
    .filter((entry) => {
      if (selectedCategory !== 'all' && entry.category !== selectedCategory) return false;
      if (
        search &&
        !entry.name.toLowerCase().includes(search.toLowerCase()) &&
        !entry.category.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const cmp = valA.localeCompare(valB);
      return sortAsc ? cmp : -cmp;
    });

  const toggleSort = (field: 'name' | 'category') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300 text-xs font-mono">
          <Table className="w-3.5 h-3.5 text-brand-400" />
          <span>Interactive Reference Guide</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
          Big-O Complexity Cheat Sheet
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Quickly compare time and space complexities across fundamental data structures and algorithms.
          Color-coded from best <span className="text-steel-300 font-mono">O(1)</span> to worst <span className="text-rose-400 font-mono">O(N²) / O(2^N)</span>.
        </p>
      </div>

      {/* Complexity Scale Legend & Visual Intuition */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-4 bg-obsidian-900/80 border border-slate-800 rounded-2xl">
        <div className="flex flex-col items-center p-2 rounded-xl bg-steel-950/40 border border-steel-500/40 text-center">
          <span className="text-xs font-mono font-bold text-steel-200">O(1)</span>
          <span className="text-[10px] text-steel-300/80 uppercase font-mono mt-0.5">Constant (Best)</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-sky-950/40 border border-sky-500/40 text-center">
          <span className="text-xs font-mono font-bold text-sky-300">O(log N)</span>
          <span className="text-[10px] text-sky-400/80 uppercase font-mono mt-0.5">Logarithmic (Great)</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-amber-950/30 border border-amber-500/30 text-center">
          <span className="text-xs font-mono font-bold text-amber-300">O(N)</span>
          <span className="text-[10px] text-amber-400/80 uppercase font-mono mt-0.5">Linear (Fair)</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-brand-950/40 border border-brand-500/30 text-center">
          <span className="text-xs font-mono font-bold text-brand-300">O(N log N)</span>
          <span className="text-[10px] text-brand-400/80 uppercase font-mono mt-0.5">Linearithmic (Bad)</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center col-span-2 sm:col-span-1">
          <span className="text-xs font-mono font-bold text-rose-300">O(N²) / O(2^N)</span>
          <span className="text-[10px] text-rose-400/80 uppercase font-mono mt-0.5">Horrible</span>
        </div>
      </div>

      {/* Filter and Search Bar (Step 3: Flex-1 Search Bar Filling Middle Space) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search structure or algorithm..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-obsidian-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-400 font-sans transition-colors"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-500/20 text-brand-300 font-bold border border-brand-500/40 shadow-sm'
                  : 'bg-obsidian-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sortable Complexity Table */}
      <div className="bg-obsidian-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-obsidian-950 border-b border-slate-800 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th
                onClick={() => toggleSort('name')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  <span>Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('category')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-600" />
                </div>
              </th>
              <th className="py-3.5 px-3 text-center">Access / Best</th>
              <th className="py-3.5 px-3 text-center">Search / Avg</th>
              <th className="py-3.5 px-3 text-center">Insert / Worst</th>
              <th className="py-3.5 px-3 text-center">Delete / Worst</th>
              <th className="py-3.5 px-3 text-center">Space</th>
              <th className="py-3.5 px-4 text-right">Simulation</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {filtered.map((item) => {
              const isDS = item.category === 'Data Structure';

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-sans font-bold text-slate-100 flex items-center gap-2">
                    <span>{item.name}</span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-sans text-[11px]">
                    <span className="px-2 py-0.5 rounded-full bg-obsidian-950 border border-slate-800">
                      {item.category}
                    </span>
                  </td>

                  {/* Metric 1 */}
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded border text-[11px] inline-block ${getComplexityBadgeClass(isDS ? item.accessAvg : item.timeBest)}`}>
                      {isDS ? item.accessAvg : item.timeBest}
                    </span>
                  </td>

                  {/* Metric 2 */}
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded border text-[11px] inline-block ${getComplexityBadgeClass(isDS ? item.searchAvg : item.timeAvg)}`}>
                      {isDS ? item.searchAvg : item.timeAvg}
                    </span>
                  </td>

                  {/* Metric 3 */}
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded border text-[11px] inline-block ${getComplexityBadgeClass(isDS ? item.insertWorst : item.timeWorst)}`}>
                      {isDS ? item.insertWorst : item.timeWorst}
                    </span>
                  </td>

                  {/* Metric 4 */}
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded border text-[11px] inline-block ${getComplexityBadgeClass(isDS ? item.deleteWorst : item.timeWorst)}`}>
                      {isDS ? item.deleteWorst : item.timeWorst}
                    </span>
                  </td>

                  {/* Space Metric */}
                  <td className="py-3.5 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded border text-[11px] inline-block ${getComplexityBadgeClass(item.spaceWorst)}`}>
                      {item.spaceWorst}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-3.5 px-4 text-right font-sans">
                    {item.flagshipTopicId ? (
                      <button
                        onClick={() => onSelectTopic(item.flagshipTopicId!)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors bg-brand-500/10 hover:bg-brand-500/20 px-2.5 py-1 rounded-lg border border-brand-500/30"
                      >
                        <span>Simulate</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-600 italic">
                        Reference
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
