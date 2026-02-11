import { Calendar, RotateCcw as ResetIcon } from 'lucide-react';

export const FilterForm = ({
  conditions,
  setConditions,
  showCustomer = true,
  onReset,
  uniquePols,
  uniquePods,
  uniqueCountries,
}) => {
  const update = (field, value) => setConditions((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">積出港 (POL)</label>
          <select
            value={conditions.pol || 'all'}
            onChange={(e) => update('pol', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50"
          >
            <option value="all">指定なし</option>
            {uniquePols.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">荷揚港 (POD)</label>
          <select
            value={conditions.pod || 'all'}
            onChange={(e) => update('pod', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50"
          >
            <option value="all">指定なし</option>
            {uniquePods.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
          <Calendar size={12} /> ETD 期間
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={conditions.etdFrom || ''}
            onChange={(e) => update('etdFrom', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px]"
          />
          <span className="text-slate-400">~</span>
          <input
            type="date"
            value={conditions.etdTo || ''}
            onChange={(e) => update('etdTo', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
          <Calendar size={12} /> B/L日 期間
        </label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={conditions.blDateFrom || ''}
            onChange={(e) => update('blDateFrom', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px]"
          />
          <span className="text-slate-400">~</span>
          <input
            type="date"
            value={conditions.blDateTo || ''}
            onChange={(e) => update('blDateTo', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-slate-400 uppercase">荷揚国</label>
        <select
          value={conditions.country || 'all'}
          onChange={(e) => update('country', e.target.value)}
          className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50"
        >
          <option value="all">指定なし</option>
          {uniqueCountries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">抹消ステータス</label>
          <select
            value={conditions.flagDereg || 'all'}
            onChange={(e) => update('flagDereg', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50"
          >
            <option value="all">指定なし</option>
            <option value="complete">完了のみ</option>
            <option value="incomplete">未完了のみ</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">ODOステータス</label>
          <select
            value={conditions.flagOdo || 'all'}
            onChange={(e) => update('flagOdo', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50"
          >
            <option value="all">指定なし</option>
            <option value="complete">完了のみ</option>
            <option value="incomplete">未完了のみ</option>
          </select>
        </div>
      </div>

      {showCustomer && (
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">顧客</label>
          <select
            value={conditions.customer || 'all'}
            onChange={(e) => update('customer', e.target.value)}
            className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50"
          >
            <option value="all">指定なし</option>
            <option value="Global Motors">Global Motors</option>
            <option value="Pacific Trading">Pacific Trading</option>
            <option value="Euro Cars">Euro Cars</option>
          </select>
        </div>
      )}

      {onReset && (
        <button
          onClick={onReset}
          className="w-full py-2 text-[11px] text-slate-500 font-bold hover:bg-slate-100 rounded border border-slate-200 transition-all flex items-center justify-center gap-1"
        >
          <ResetIcon size={12} /> 条件をリセット
        </button>
      )}
    </div>
  );
};
