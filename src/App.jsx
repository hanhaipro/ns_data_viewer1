import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Settings, 
  Filter, 
  AlertTriangle, 
  ChevronDown, 
  Pencil, 
  Copy, 
  Search,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  Save,
  Undo2,
  X,
  Columns,
  RotateCcw,
  ArrowDownToLine,
  ListPlus,
  Check,
  Calendar,
  Eye,
  EyeOff,
  Palette,
  Layers,
  ArrowUp,
  ArrowDown,
  GripVertical,
  ArrowUpDown,
  Pipette,
  Ship,
  FileWarning,
  MapPin,
  Flag,
  Anchor,
  FileText,
  Activity,
  RotateCcw as ResetIcon,
  Type,
  Grid,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';

// --- ダミーデータ生成関数 ---
const generateDummyData = (count) => {
  const customers = ['Global Motors', 'Pacific Trading', 'Euro Cars', 'Sydney Auto', 'Afritrade'];
  const vessels = ['Blue Ocean', 'Sun Rise', 'Baltic Sea', 'Southern Cross', 'Nile Star', 'Ocean King'];
  const pols = ['Yokohama', 'Nagoya', 'Osaka', 'Kobe', 'Hakata'];
  // PODとCountryの組み合わせ定義
  const destinations = [
    { pod: 'Mombasa', country: 'Kenya' },
    { pod: 'Dar es Salaam', country: 'Tanzania' },
    { pod: 'Limassol', country: 'Cyprus' },
    { pod: 'Melbourne', country: 'Australia' },
    { pod: 'Durban', country: 'South Africa' },
    { pod: 'Jebel Ali', country: 'UAE' },
    { pod: 'Kingston', country: 'Jamaica' }
  ];
  const carNames = ['Toyota Prius', 'Nissan Leaf', 'Honda Fit', 'Subaru Impreza', 'Mazda CX-5', 'Toyota RAV4', 'Suzuki Swift', 'Toyota Aqua', 'Honda Vezel', 'Nissan X-Trail'];
  const statuses = ['完了', '未'];

  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const vessel = vessels[Math.floor(Math.random() * vessels.length)];
    const pol = pols[Math.floor(Math.random() * pols.length)];
    
    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    const carName = carNames[Math.floor(Math.random() * carNames.length)];
    
    // 日付生成 (2026年)
    // 1月〜4月くらいを中心に生成
    const start = new Date('2026-01-01').getTime();
    const end = new Date('2026-05-30').getTime();
    const orderTime = start + Math.random() * (end - start);
    const orderDateObj = new Date(orderTime);
    const orderDate = orderDateObj.toISOString().split('T')[0];

    // ETDはOrderの15~45日後
    const etdTime = orderTime + (15 + Math.random() * 30) * 24 * 60 * 60 * 1000;
    const etdDateObj = new Date(etdTime);
    const etd = etdDateObj.toISOString().split('T')[0];

    // B/LはETDの2~7日後 (未発行のものも混ぜる)
    let blDate = '';
    if (Math.random() > 0.15) { // 85%は発行済み
        const blTime = etdTime + (2 + Math.random() * 5) * 24 * 60 * 60 * 1000;
        blDate = new Date(blTime).toISOString().split('T')[0];
    }

    // 書類やフラグもランダムに欠落させる
    const invCustoms = Math.random() > 0.1 ? `INV-C-${90000 + id}` : '';
    const flagDereg = Math.random() > 0.2 ? '完了' : '未';
    const flagOdo = Math.random() > 0.2 ? '完了' : '未';

    return {
      id,
      chassis: `ABC-${100000 + id}`, // 車台番号
      orderNo: `ORD-${20260000 + id}`,
      orderDate,
      customer,
      vessel,
      pol,
      etd,
      pod: dest.pod,
      country: dest.country,
      carName,
      flagDereg,
      flagOdo,
      invCustoms,
      siNo: `SI-${50000 + id}`,
      invSales: Math.random() > 0.1 ? `INV-S-${30000 + id}` : '',
      blDate
    };
  });
};

const App = () => {
  // --- 1. カラム（列）の初期定義 ---
  const initialColumns = [
    { id: 'rowNo', label: 'No.', width: 50, sticky: true, visible: true },
    { id: 'chassis', label: '車台番号', width: 140, sticky: true, visible: true },
    { id: 'orderNo', label: '受注番号', width: 110, visible: true },
    { id: 'orderDate', label: '受注日', width: 100, visible: true },
    { id: 'customer', label: '顧客名', width: 140, visible: true },
    { id: 'vessel', label: '船名', width: 120, visible: true },
    { id: 'pol', label: '積出港', width: 100, visible: true },
    { id: 'etd', label: 'ETD', width: 110, visible: true },
    { id: 'pod', label: '荷揚港', width: 100, visible: true },
    { id: 'country', label: '荷揚国', width: 110, visible: true },
    { id: 'carName', label: '車名', width: 130, visible: true },
    { id: 'flagDereg', label: '抹消完了', width: 90, visible: true },
    { id: 'flagOdo', label: 'ODO完了', width: 90, visible: true },
    { id: 'invCustoms', label: '通関INV', width: 130, visible: true },
    { id: 'siNo', label: 'S/i番号', width: 110, visible: true },
    { id: 'invSales', label: '売上INV', width: 130, visible: true },
    { id: 'blDate', label: 'B/L日', width: 100, visible: true },
  ];

  const [columns, setColumns] = useState(initialColumns);

  // --- 2. データセット (1000件生成) ---
  const [data, setData] = useState(() => generateDummyData(1000));
  
  const [selectedRow, setSelectedRow] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('filter');
  
  // ソート設定
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // ページネーション設定
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  // ドラッグ＆ドロップ用の参照
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // リサイズ用の参照
  const resizingColumn = useRef(null);
  const startX = useRef(0);
  const startWidth = useRef(0);
   
  const [highlightedRows, setHighlightedRows] = useState([]);
  const [rangeFillState, setRangeFillState] = useState({ isOpen: false, startRowId: null, field: null, targetRowNumber: '' });

  // 選択肢の生成（ユニーク値）
  const uniquePols = useMemo(() => [...new Set(data.map(d => d.pol).filter(Boolean))].sort(), [data]);
  const uniquePods = useMemo(() => [...new Set(data.map(d => d.pod).filter(Boolean))].sort(), [data]);
  const uniqueCountries = useMemo(() => [...new Set(data.map(d => d.country).filter(Boolean))].sort(), [data]);

  // --- 3. 強化：フィルターの状態 ---
  const defaultFilterConditions = {
    pol: 'all',
    etdFrom: '',
    etdTo: '',
    pod: 'all',
    country: 'all',
    blDateFrom: '',
    blDateTo: '',
    flagDereg: 'all',
    flagOdo: 'all',
    customer: 'all',
  };

  const [searchText, setSearchText] = useState('');
  const [filterConditions, setFilterConditions] = useState(defaultFilterConditions);

  // --- 4. 強化：警告設定 ---
  const [warningSettings, setWarningSettings] = useState({
    etdEnabled: true,
    etdDays: 7,
    missingInvoiceEnabled: true,
    missingFlagEnabled: true,
    alertTheme: 'rose',
    customAlertColor: '#e11d48'
  });

  // --- 5. 強化：表示設定 ---
  const defaultHighlightConditions = {
    active: false,
    pol: 'all',
    etdFrom: '',
    etdTo: '',
    pod: 'all',
    country: 'all',
    blDateFrom: '',
    blDateTo: '',
    flagDereg: 'all',
    flagOdo: 'all',
    customer: 'all',
  };

  const [displaySettings, setDisplaySettings] = useState({
    rowDensity: 'compact',
    headerColor: '#1e293b',
    autoHighlightEnabled: true,
    highlightConditions: defaultHighlightConditions,
    highlightColor: '#fff7ed',
    borderColor: '#e2e8f0',
    textColor: '#1e293b',
  });

  // アラートのテーマ定義
  const alertStyles = {
    rose: { text: 'text-rose-600', icon: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100', title: 'text-rose-900', accent: 'accent-rose-500', range: 'text-rose-600' },
    amber: { text: 'text-amber-600', icon: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100', title: 'text-amber-900', accent: 'accent-amber-500', range: 'text-amber-600' },
    violet: { text: 'text-violet-600', icon: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-100', title: 'text-violet-900', accent: 'accent-violet-500', range: 'text-violet-600' }
  };

  const getAlertStyles = () => {
    if (warningSettings.alertTheme === 'custom') {
      return {
        text: '',
        icon: '',
        bg: 'bg-slate-50',
        border: 'border-slate-200',
        title: 'text-slate-800',
        accent: 'accent-slate-500',
        range: 'text-slate-600',
        isCustom: true,
        color: warningSettings.customAlertColor
      };
    }
    return alertStyles[warningSettings.alertTheme] || alertStyles.rose;
  };

  const currentAlertStyle = getAlertStyles();
  const today = new Date('2026-02-09');

  // --- 汎用判定ロジック (AND/OR 対応版) ---
  const checkConditions = (item, cond, matchMode = 'AND') => {
    const checks = [];

    if (cond.pol && cond.pol !== 'all') checks.push(() => item.pol === cond.pol);
    if (cond.pod && cond.pod !== 'all') checks.push(() => item.pod === cond.pod);
    if (cond.country && cond.country !== 'all') checks.push(() => item.country === cond.country);
    if (cond.customer && cond.customer !== 'all') checks.push(() => item.customer === cond.customer);
    
    if (cond.etdFrom || cond.etdTo) {
      checks.push(() => {
        if (cond.etdFrom && new Date(item.etd) < new Date(cond.etdFrom)) return false;
        if (cond.etdTo && new Date(item.etd) > new Date(cond.etdTo)) return false;
        return true;
      });
    }

    if (cond.blDateFrom || cond.blDateTo) {
      checks.push(() => {
        if (cond.blDateFrom && (!item.blDate || new Date(item.blDate) < new Date(cond.blDateFrom))) return false;
        if (cond.blDateTo && (!item.blDate || new Date(item.blDate) > new Date(cond.blDateTo))) return false;
        return true;
      });
    }

    if (cond.flagDereg && cond.flagDereg !== 'all') {
      checks.push(() => {
        if (cond.flagDereg === 'complete' && item.flagDereg !== '完了') return false;
        if (cond.flagDereg === 'incomplete' && item.flagDereg === '完了') return false;
        return true;
      });
    }

    if (cond.flagOdo && cond.flagOdo !== 'all') {
      checks.push(() => {
        if (cond.flagOdo === 'complete' && item.flagOdo !== '完了') return false;
        if (cond.flagOdo === 'incomplete' && item.flagOdo === '完了') return false;
        return true;
      });
    }

    if (checks.length === 0) return matchMode === 'AND';

    if (matchMode === 'OR') {
      return checks.some(fn => fn());
    } else {
      return checks.every(fn => fn());
    }
  };

  // --- 6. 検索・フィルタ・ソートロジックの統合 ---
  const processedData = useMemo(() => {
    let result = data.filter(item => {
      const matchesSearch = Object.values(item).some(val => 
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );
      const matchesFilter = checkConditions(item, filterConditions, 'AND');
      return matchesSearch && matchesFilter;
    });

    if (sortConfig.key) {
      result.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
        if (sortConfig.key.toLowerCase().includes('date') || sortConfig.key === 'etd') {
            valA = valA ? new Date(valA).getTime() : 0;
            valB = valB ? new Date(valB).getTime() : 0;
        } else {
            valA = String(valA || '').toLowerCase();
            valB = String(valB || '').toLowerCase();
        }
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, searchText, filterConditions, sortConfig]);

  // フィルタやソートが変わったらページをリセット
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, filterConditions, sortConfig]);

  // ページネーションデータの計算
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (columnId) => {
    if (columnId === 'rowNo') return;
    let direction = 'asc';
    if (sortConfig.key === columnId) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else {
        setSortConfig({ key: null, direction: 'asc' });
        return;
      }
    }
    setSortConfig({ key: columnId, direction });
  };

  // --- 7. 警告判定ロジック ---
  const getRowWarnings = (row) => {
    const warnings = [];
    if (warningSettings.etdEnabled) {
      const etdDate = new Date(row.etd);
      const diffDays = Math.ceil((etdDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= warningSettings.etdDays) warnings.push('ETD接近');
    }
    if (warningSettings.missingInvoiceEnabled && !row.invCustoms) warnings.push('書類欠落');
    if (warningSettings.missingFlagEnabled && (row.flagDereg === '未' || row.flagOdo === '未')) warnings.push('Flag未完了');
    
    return warnings;
  };

  // --- 8. コピー・フィル機能 ---
  const copyFromAbove = (rowId, field) => {
    const currentIndex = data.findIndex(r => r.id === rowId);
    if (currentIndex > 0) {
      const prevValue = data[currentIndex - 1][field];
      setData(prev => prev.map(r => r.id === rowId ? { ...r, [field]: prevValue } : r));
      triggerHighlight([rowId]);
    }
  };

  const fillToBottom = (rowId, field) => {
    const currentIndex = data.findIndex(r => r.id === rowId);
    const valueToCopy = data[currentIndex][field];
    const targetRowIds = [];
    const newData = data.map((r, index) => {
      if (index > currentIndex) { targetRowIds.push(r.id); return { ...r, [field]: valueToCopy }; }
      return r;
    });
    setData(newData);
    triggerHighlight(targetRowIds);
  };

  const executeRangeFill = () => {
    const { startRowId, field, targetRowNumber } = rangeFillState;
    const startIndex = data.findIndex(r => r.id === startRowId);
    const targetIndex = parseInt(targetRowNumber) - 1;
    if (isNaN(targetIndex) || targetIndex <= startIndex || targetIndex >= data.length) {
      setRangeFillState({ ...rangeFillState, isOpen: false }); return;
    }
    const valueToCopy = data[startIndex][field];
    const targetRowIds = [];
    const newData = data.map((r, index) => {
      if (index > startIndex && index <= targetIndex) { targetRowIds.push(r.id); return { ...r, [field]: valueToCopy }; }
      return r;
    });
    setData(newData);
    triggerHighlight(targetRowIds);
    setRangeFillState({ ...rangeFillState, isOpen: false, targetRowNumber: '' });
  };

  const triggerHighlight = (rowIds) => {
    setHighlightedRows(rowIds);
    setTimeout(() => setHighlightedRows([]), 800);
  };

  const getFlagEmoji = (country) => {
    const map = { 'Kenya': '🇰🇪', 'Tanzania': '🇹🇿', 'Cyprus': '🇨🇾', 'Australia': '🇦🇺', 'South Africa': '🇿🇦', 'UAE': '🇦🇪', 'Jamaica': '🇯🇲' };
    return map[country] || '🏳️';
  };

  const highlightText = (text, highlight) => {
    if (!highlight || !text) return text;
    const parts = String(text).split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-amber-300 text-black font-bold rounded-[2px] px-0.5 mx-[-2px]">{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // --- 列幅入力用コンポーネント ---
  const ColumnWidthInput = ({ colId, width, onUpdate }) => {
    const [tempValue, setTempValue] = useState(width);

    useEffect(() => {
      setTempValue(width);
    }, [width]);

    const handleChange = (e) => {
      setTempValue(e.target.value);
    };

    const handleBlur = () => {
      const val = parseInt(tempValue);
      if (!isNaN(val) && val > 0) {
        onUpdate(colId, val);
      } else {
        setTempValue(width); // 元に戻す
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        handleBlur();
        e.target.blur();
      }
    };

    return (
      <input 
        type="number" 
        value={tempValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-14 p-1 border border-slate-200 rounded text-right text-[10px] focus:ring-1 ring-indigo-500 outline-none"
      />
    );
  };

  // --- 列幅リサイズ関数 ---
  const startResizing = (e, colId) => {
    e.preventDefault();
    e.stopPropagation();
    resizingColumn.current = colId;
    startX.current = e.pageX;
    startWidth.current = columns.find(c => c.id === colId).width;
    document.addEventListener('mousemove', handleResizing);
    document.addEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'col-resize';
  };
  const handleResizing = (e) => {
    if (resizingColumn.current) {
      const diff = e.pageX - startX.current;
      updateColumnWidthState(resizingColumn.current, Math.max(30, startWidth.current + diff));
    }
  };
  const stopResizing = () => {
    resizingColumn.current = null;
    document.removeEventListener('mousemove', handleResizing);
    document.removeEventListener('mouseup', stopResizing);
    document.body.style.cursor = 'default';
  };
  const updateColumnWidthState = (colId, width) => {
    setColumns(prev => prev.map(col => 
      col.id === colId ? { ...col, width: parseInt(width) || 0 } : col
    ));
  };
  const toggleColumnVisibility = (colId) => {
    setColumns(prev => prev.map(col => 
      col.id === colId ? { ...col, visible: !col.visible } : col
    ));
  };
  const moveColumn = (index, direction) => {
    const newColumns = [...columns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newColumns.length) {
      [newColumns[index], newColumns[targetIndex]] = [newColumns[targetIndex], newColumns[index]];
      setColumns(newColumns);
    }
  };

  // DnD Handlers
  const handleDragStart = (e, index) => { dragItem.current = index; e.dataTransfer.effectAllowed = "move"; };
  const handleDragEnter = (e, index) => { dragOverItem.current = index; };
  const handleDragEnd = (e) => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) { dragItem.current = null; dragOverItem.current = null; return; }
    const newColumns = [...columns];
    const dragColumn = newColumns[dragItem.current];
    newColumns.splice(dragItem.current, 1);
    newColumns.splice(dragOverItem.current, 0, dragColumn);
    setColumns(newColumns);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // --- 共通フィルタフォームコンポーネント ---
  const FilterForm = ({ conditions, setConditions, showCustomer = true, onReset }) => {
    const update = (field, value) => setConditions(prev => ({ ...prev, [field]: value }));
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">積出港 (POL)</label>
            <select value={conditions.pol || 'all'} onChange={(e) => update('pol', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50">
              <option value="all">指定なし</option>
              {uniquePols.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">荷揚港 (POD)</label>
            <select value={conditions.pod || 'all'} onChange={(e) => update('pod', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50">
              <option value="all">指定なし</option>
              {uniquePods.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> ETD 期間</label>
          <div className="flex items-center gap-2">
            <input type="date" value={conditions.etdFrom || ''} onChange={(e) => update('etdFrom', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px]" />
            <span className="text-slate-400">~</span>
            <input type="date" value={conditions.etdTo || ''} onChange={(e) => update('etdTo', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px]" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> B/L日 期間</label>
          <div className="flex items-center gap-2">
            <input type="date" value={conditions.blDateFrom || ''} onChange={(e) => update('blDateFrom', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px]" />
            <span className="text-slate-400">~</span>
            <input type="date" value={conditions.blDateTo || ''} onChange={(e) => update('blDateTo', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px]" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">荷揚国</label>
          <select value={conditions.country || 'all'} onChange={(e) => update('country', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50">
            <option value="all">指定なし</option>
            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">抹消ステータス</label>
            <select value={conditions.flagDereg || 'all'} onChange={(e) => update('flagDereg', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50">
              <option value="all">指定なし</option>
              <option value="complete">完了のみ</option>
              <option value="incomplete">未完了のみ</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">ODOステータス</label>
            <select value={conditions.flagOdo || 'all'} onChange={(e) => update('flagOdo', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50">
              <option value="all">指定なし</option>
              <option value="complete">完了のみ</option>
              <option value="incomplete">未完了のみ</option>
            </select>
          </div>
        </div>

        {showCustomer && (
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">顧客</label>
            <select value={conditions.customer || 'all'} onChange={(e) => update('customer', e.target.value)} className="w-full p-1.5 border border-slate-200 rounded text-[11px] bg-slate-50">
              <option value="all">指定なし</option>
              <option value="Global Motors">Global Motors</option>
              <option value="Pacific Trading">Pacific Trading</option>
              <option value="Euro Cars">Euro Cars</option>
            </select>
          </div>
        )}
        
        {onReset && (
           <button onClick={onReset} className="w-full py-2 text-[11px] text-slate-500 font-bold hover:bg-slate-100 rounded border border-slate-200 transition-all flex items-center justify-center gap-1">
             <ResetIcon size={12} /> 条件をリセット
           </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-100 font-sans text-[12px] text-slate-800 overflow-hidden" style={{ color: displaySettings.textColor }}>
      
      {/* 画面ヘッダー */}
      <header className="flex items-center justify-between px-4 h-14 text-white shadow-lg z-30 shrink-0" style={{ backgroundColor: displaySettings.headerColor }}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight leading-none mb-0.5">日貿</h1>
              <p className="text-[9px] opacity-70 font-medium uppercase tracking-widest">Enterprise Edition v1.0</p>
            </div>
          </div>
          <div className="flex bg-white/10 rounded-lg h-9 items-center border border-white/20 focus-within:ring-2 ring-white/50 transition-all px-3">
            <Search size={14} className="opacity-60" />
            <input 
              type="text" 
              placeholder="全項目から検索..." 
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-transparent border-none outline-none text-[11px] w-64 ml-2 placeholder-white/40 text-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button onClick={() => {setSettingsOpen(!settingsOpen); setActiveTab('filter')}} className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'filter' && settingsOpen ? 'bg-white/20 ring-1 ring-white/40' : 'hover:bg-white/10'}`}>
            <Filter size={16} /> <span>フィルタ</span>
          </button>
          <button onClick={() => {setSettingsOpen(!settingsOpen); setActiveTab('warning')}} className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'warning' && settingsOpen ? 'bg-white/20 ring-1 ring-white/40' : 'hover:bg-white/10'}`}>
            <AlertTriangle size={16} className="text-amber-400" /> <span>警告</span>
          </button>
          <button onClick={() => {setSettingsOpen(!settingsOpen); setActiveTab('columns')}} className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'columns' && settingsOpen ? 'bg-white/20 ring-1 ring-white/40' : 'hover:bg-white/10'}`}>
            <Columns size={16} /> <span>列/並び順</span>
          </button>
          <button onClick={() => {setSettingsOpen(!settingsOpen); setActiveTab('highlight')}} className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${activeTab === 'highlight' && settingsOpen ? 'bg-white/20 ring-1 ring-white/40' : 'hover:bg-white/10'}`}>
            <Settings size={16} /> <span>表示</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* メインテーブル */}
        <div className="flex-1 overflow-auto bg-white" id="table-scroll-parent">
          <table 
            className="border-separate border-spacing-0" 
            style={{ 
              tableLayout: 'fixed', 
              width: columns.filter(c => c.visible).reduce((acc, col) => acc + col.width, 0) + 48, 
              minWidth: '100%'
            }}
          >
            <thead className="sticky top-0 z-20 shadow-md">
              <tr>
                {columns.filter(c => c.visible).map((col, index, array) => {
                  let leftPos = 0;
                  if (col.sticky) {
                     for (let i = 0; i < index; i++) {
                       if (array[i].sticky) leftPos += array[i].width;
                     }
                  }
                  const isSorted = sortConfig.key === col.id;
                  const canSort = col.id !== 'rowNo';
                  return (
                    <th
                      key={col.id}
                      onClick={() => canSort && handleSort(col.id)}
                      style={{ 
                        width: `${col.width}px`, 
                        left: col.sticky ? `${leftPos}px` : 'auto',
                        zIndex: col.sticky ? 25 : 1,
                        backgroundColor: displaySettings.headerColor
                      }}
                      className={`
                        text-white font-bold text-[11px] px-2 py-2 border-r border-white/10 border-b-2 border-white/20
                        relative select-none text-left
                        ${col.sticky ? 'sticky' : ''}
                        ${canSort ? 'cursor-pointer hover:bg-white/10 transition-colors' : ''}
                      `}
                    >
                      <div className="flex items-center justify-between truncate gap-1">
                        <span className="truncate uppercase opacity-90">{col.label}</span>
                        {canSort && (
                          <div className={`shrink-0 ${isSorted ? 'opacity-100 text-amber-300' : 'opacity-30'}`}>
                            {isSorted ? (
                              sortConfig.direction === 'asc' ? <ArrowUp size={10} /> : <ArrowDown size={10} />
                            ) : (
                              <ArrowUpDown size={10} />
                            )}
                          </div>
                        )}
                      </div>
                      <div onMouseDown={(e) => startResizing(e, col.id)} className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-white/30 z-30" />
                    </th>
                  );
                })}
                <th style={{ backgroundColor: displaySettings.headerColor }} className="w-12 sticky right-0 z-20 border-b-2 border-white/20"></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, rowIndex) => {
                const isActive = selectedRow === row.id;
                const rowWarnings = getRowWarnings(row);
                const isEditing = editingRowId === row.id;
                const isActionHighlight = highlightedRows.includes(row.id);
                
                // ハイライト判定 (拡張版)
                let isHighlight = false;
                if (displaySettings.autoHighlightEnabled && displaySettings.highlightConditions.active) {
                  isHighlight = checkConditions(row, displaySettings.highlightConditions, 'OR');
                }

                const rowHeightClass = displaySettings.rowDensity === 'standard' ? 'h-10' : displaySettings.rowDensity === 'compact' ? 'h-7' : 'h-6';

                return (
                  <tr 
                    key={row.id}
                    onClick={() => setSelectedRow(row.id)}
                    className={`
                      group transition-all duration-300
                      ${isActive ? 'bg-sky-100 ring-1 ring-inset ring-sky-300' : isActionHighlight ? 'bg-indigo-100' : 'bg-white hover:bg-slate-50'}
                    `}
                    style={{
                      backgroundColor: (isHighlight && !isActive && !isActionHighlight) ? displaySettings.highlightColor : undefined
                    }}
                  >
                    {columns.filter(c => c.visible).map((col, index, array) => {
                      // 行番号はページングを考慮
                      let value = col.id === 'rowNo' ? startIndex + rowIndex + 1 : row[col.id];
                      const isSticky = col.sticky;
                      const isTargeting = rangeFillState.isOpen && rangeFillState.startRowId === row.id && rangeFillState.field === col.id;
                      let leftPos = 0;
                      if (col.sticky) {
                         for (let i = 0; i < index; i++) {
                           if (array[i].sticky) leftPos += array[i].width;
                         }
                      }
                      
                      // 警告スタイル
                      let cellStyle = {};
                      let iconClass = currentAlertStyle.icon;
                      let textClass = '';
                      
                      if (currentAlertStyle.isCustom && col.id === 'etd' && rowWarnings.includes('ETD接近')) {
                        cellStyle = { color: currentAlertStyle.color, fontWeight: 'bold' };
                      } else if (col.id === 'etd' && rowWarnings.includes('ETD接近')) {
                        textClass = `${currentAlertStyle.text} font-bold`;
                      }

                      return (
                        <td
                          key={col.id}
                          style={{ 
                            width: `${col.width}px`, 
                            left: isSticky ? `${leftPos}px` : 'auto', 
                            zIndex: isSticky ? 10 : 1,
                            borderColor: displaySettings.borderColor,
                            ...cellStyle
                          }}
                          className={`
                            ${isSticky ? 'sticky bg-inherit shadow-[1px_0_0_0_#e2e8f0]' : ''}
                            px-2 py-0 border-r border-b truncate ${rowHeightClass}
                            ${textClass}
                            ${displaySettings.rowDensity === 'x-compact' ? 'text-[11px]' : 'text-[12px]'}
                            ${col.id === 'rowNo' ? 'text-center opacity-100 font-mono bg-slate-50' : ''}
                          `}
                        >
                          <div className={`flex items-center ${col.id === 'rowNo' ? 'justify-center' : 'justify-between'} group/cell relative overflow-hidden h-full`}>
                            <div className="flex items-center gap-1.5 truncate w-full">
                              {col.id === 'chassis' && rowWarnings.length > 0 && (
                                <AlertTriangle 
                                  size={12} 
                                  className={`${iconClass} shrink-0`} 
                                  style={currentAlertStyle.isCustom ? { color: currentAlertStyle.color } : {}}
                                  title={rowWarnings.join(', ')} 
                                />
                              )}
                              {isEditing && !col.sticky && col.id !== 'rowNo' ? (
                                <input 
                                  type="text" value={value}
                                  onChange={(e) => {
                                    const newData = [...data];
                                    const idx = newData.findIndex(r => r.id === row.id);
                                    newData[idx][col.id] = e.target.value;
                                    setData(newData);
                                  }}
                                  className="w-full bg-white border border-sky-400 rounded px-1 py-0 outline-none h-5 text-[11px]"
                                />
                              ) : (
                                <span className="truncate w-full">
                                  {col.id === 'country' ? (
                                    <span>{getFlagEmoji(value)} {highlightText(value, searchText)}</span>
                                  ) : col.id === 'flagDereg' || col.id === 'flagOdo' ? (
                                    <span className={`flex items-center gap-1 font-medium ${value === '完了' ? 'text-emerald-600' : 'text-slate-400'}`}>
                                      {value === '完了' ? <CheckCircle2 size={11}/> : <XCircle size={11}/>}
                                      {highlightText(value, searchText)}
                                    </span>
                                  ) : col.id === 'rowNo' ? (
                                    value
                                  ) : (
                                    highlightText(value, searchText)
                                  )}
                                </span>
                              )}
                            </div>
                            
                            {isEditing && !col.sticky && col.id !== 'rowNo' && (
                              <div className="hidden group-hover/cell:flex items-center gap-0.5 absolute right-0 top-[-2px] z-50 bg-white shadow-sm border border-slate-200 rounded p-0.5 scale-90">
                                <button onClick={(e) => { e.stopPropagation(); copyFromAbove(row.id, col.id); }} className="p-1 bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-600 hover:text-white" title="上からコピー"><Copy size={10} /></button>
                                <button onClick={(e) => { e.stopPropagation(); fillToBottom(row.id, col.id); }} className="p-1 bg-emerald-50 text-emerald-600 rounded hover:bg-emerald-600 hover:text-white" title="下すべて"><ArrowDownToLine size={10} /></button>
                                <button onClick={(e) => { e.stopPropagation(); setRangeFillState({ isOpen: true, startRowId: row.id, field: col.id, targetRowNumber: '' }); }} className="p-1 bg-sky-50 text-sky-600 rounded hover:bg-sky-600 hover:text-white" title="指定行まで"><ListPlus size={10} /></button>
                              </div>
                            )}

                            {isTargeting && (
                              <div className="absolute inset-0 bg-white z-[60] flex items-center px-1 shadow-inner border border-sky-500 rounded">
                                <span className="text-[10px] text-sky-600 font-bold mr-1">迄:</span>
                                <input 
                                  type="number" value={rangeFillState.targetRowNumber}
                                  onChange={(e) => setRangeFillState({ ...rangeFillState, targetRowNumber: e.target.value })}
                                  className="w-10 text-[10px] border border-slate-200 rounded px-1 outline-none focus:border-sky-500"
                                  autoFocus
                                  onKeyDown={(e) => { if (e.key === 'Enter') executeRangeFill(); if (e.key === 'Escape') setRangeFillState({ ...rangeFillState, isOpen: false }); }}
                                />
                                <button onClick={executeRangeFill} className="ml-1 p-0.5 bg-sky-500 text-white rounded"><Check size={10}/></button>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                    <td className="w-12 px-1 flex items-center justify-center sticky right-0 bg-inherit shadow-[-1px_0_0_0_#e2e8f0] border-b border-slate-100 h-full">
                      <button onClick={(e) => { e.stopPropagation(); setEditingRowId(editingRowId === row.id ? null : row.id); }} className={`p-1 rounded-md transition-all ${isEditing ? 'bg-emerald-500 text-white shadow' : 'hover:bg-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-600'}`}>
                        {isEditing ? <Save size={14} /> : <Pencil size={14} />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 設定サイドパネル */}
        {settingsOpen && (
          <div className="w-80 border-l border-slate-200 bg-white shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 shrink-0">
              <h2 className="font-bold flex items-center gap-2 text-slate-700">
                {activeTab === 'filter' && <><Filter size={18} className="text-sky-500" /> 高度なフィルター</>}
                {activeTab === 'warning' && <><AlertTriangle size={18} className="text-rose-500" /> アラート設定</>}
                {activeTab === 'columns' && <><Columns size={18} className="text-indigo-500" /> 列表示・並び順</>}
                {activeTab === 'highlight' && <><Settings size={18} /> デザイン・UI設定</>}
              </h2>
              <button onClick={() => setSettingsOpen(false)} className="p-1 hover:bg-slate-200 rounded-full text-slate-400"><X size={20} /></button>
            </div>

            <div className="flex-1 p-5 space-y-6 overflow-y-auto">
              
              {/* --- 1. 高度なフィルター --- */}
              {activeTab === 'filter' && (
                <div className="space-y-6">
                  {/* 船名検索・未入力項目のみ・リセットボタン 削除 */}
                  <FilterForm 
                    conditions={filterConditions} 
                    setConditions={setFilterConditions} 
                    showVessel={false} 
                  />
                  
                  <button onClick={() => setFilterConditions(defaultFilterConditions)} className="w-full py-2 text-[11px] text-rose-500 font-bold hover:bg-rose-50 rounded border border-rose-100 transition-all">全フィルターリセット</button>
                </div>
              )}

              {/* --- 2. アラート条件設定 --- */}
              {activeTab === 'warning' && (
                <div className="space-y-6">
                  {/* アラート項目 */}
                  <div className={`p-4 ${currentAlertStyle.isCustom ? 'bg-slate-50' : currentAlertStyle.bg} border ${currentAlertStyle.isCustom ? 'border-slate-200' : currentAlertStyle.border} rounded-xl space-y-4 shadow-sm`}>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className={`text-xs font-bold ${currentAlertStyle.isCustom ? 'text-slate-800' : currentAlertStyle.title}`}>ETD警告 (日付接近)</span>
                      <input type="checkbox" checked={warningSettings.etdEnabled} onChange={() => setWarningSettings({...warningSettings, etdEnabled: !warningSettings.etdEnabled})} className="w-4 h-4 accent-slate-700" />
                    </label>
                    <div className="flex items-center gap-3">
                      <input type="range" min="0" max="30" value={warningSettings.etdDays} onChange={(e) => setWarningSettings({...warningSettings, etdDays: parseInt(e.target.value)})} className="flex-1 accent-slate-400 h-1" />
                      <span className={`text-xs font-black w-12 text-right ${currentAlertStyle.isCustom ? 'text-slate-600' : currentAlertStyle.range}`}>{warningSettings.etdDays} 日内</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">警告対象の項目</label>
                    <label className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                      <span className="text-[11px] font-medium text-slate-600">書類（インボイス）の未着</span>
                      <input type="checkbox" checked={warningSettings.missingInvoiceEnabled} onChange={() => setWarningSettings({...warningSettings, missingInvoiceEnabled: !warningSettings.missingInvoiceEnabled})} className="accent-slate-600" />
                    </label>
                    <label className="flex items-center justify-between p-3 border border-slate-100 rounded-lg hover:bg-slate-50 cursor-pointer transition-all">
                      <span className="text-[11px] font-medium text-slate-600">抹消/ODOの未完了</span>
                      <input type="checkbox" checked={warningSettings.missingFlagEnabled} onChange={() => setWarningSettings({...warningSettings, missingFlagEnabled: !warningSettings.missingFlagEnabled})} className="accent-slate-600" />
                    </label>
                    
                    {/* B/L未発行警告 削除 */}
                  </div>

                  {/* 3. 警告色テーマ設定 (カラーピッカー) */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">警告色テーマ</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'rose', label: 'Red' },
                        { id: 'amber', label: 'Orange' },
                        { id: 'violet', label: 'Purple' }
                      ].map(theme => (
                        <button
                          key={theme.id}
                          onClick={() => setWarningSettings({ ...warningSettings, alertTheme: theme.id })}
                          className={`flex-1 py-1.5 text-[10px] font-bold rounded-md border transition-all ${
                            warningSettings.alertTheme === theme.id 
                              ? `${alertStyles[theme.id].bg} ${alertStyles[theme.id].border} ${alertStyles[theme.id].text} ring-1 ring-inset` 
                              : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {theme.label}
                        </button>
                      ))}
                      {/* カスタムカラー選択ボタン */}
                      <label className={`flex-1 py-1.5 text-[10px] font-bold rounded-md border transition-all cursor-pointer flex items-center justify-center gap-1 ${warningSettings.alertTheme === 'custom' ? 'bg-slate-100 border-slate-300 text-slate-800 ring-1 ring-slate-300' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                        <Pipette size={10} /> Custom
                        <input 
                           type="radio" 
                           name="alertTheme" 
                           checked={warningSettings.alertTheme === 'custom'} 
                           onChange={() => setWarningSettings({...warningSettings, alertTheme: 'custom'})} 
                           className="hidden" 
                        />
                      </label>
                    </div>
                    
                    {/* カスタムカラーピッカー表示 */}
                    {warningSettings.alertTheme === 'custom' && (
                       <div className="flex items-center gap-2 mt-2 p-2 bg-slate-50 rounded border border-slate-200">
                          <input 
                            type="color" 
                            value={warningSettings.customAlertColor}
                            onChange={(e) => setWarningSettings({...warningSettings, customAlertColor: e.target.value})}
                            className="w-8 h-6 rounded cursor-pointer border border-slate-300"
                          />
                          <span className="text-[10px] font-mono text-slate-500">{warningSettings.customAlertColor}</span>
                       </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- 列表示・個別幅設定 & 並び替え --- */}
              {activeTab === 'columns' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">表示順 / 項目 / 幅</p>
                    <button onClick={() => setColumns(initialColumns)} className="text-[10px] text-indigo-600 hover:underline">全リセット</button>
                  </div>
                  <div className="border border-slate-100 rounded-xl bg-slate-50/50 max-h-[400px] overflow-y-auto shadow-inner">
                    {columns.map((col, index) => (
                      <div 
                        key={col.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex items-center justify-between p-2 bg-white border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-all cursor-move active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing">
                            <GripVertical size={14} />
                          </div>
                          <div className="flex flex-col gap-0.5 mr-1 hidden sm:flex">
                            <button onClick={() => moveColumn(index, 'up')} disabled={index === 0} className="p-0.5 hover:bg-slate-100 rounded text-slate-300 hover:text-indigo-600 disabled:opacity-10"><ArrowUp size={8} /></button>
                            <button onClick={() => moveColumn(index, 'down')} disabled={index === columns.length - 1} className="p-0.5 hover:bg-slate-100 rounded text-slate-300 hover:text-indigo-600 disabled:opacity-10"><ArrowDown size={8} /></button>
                          </div>
                          <button onClick={() => toggleColumnVisibility(col.id)} className={`p-1 rounded ${col.visible ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-300'}`}>{col.visible ? <Eye size={14}/> : <EyeOff size={14}/>}</button>
                          <span className={`text-[11px] ${col.visible ? 'text-slate-700 font-medium' : 'text-slate-400 line-through'}`}>{col.label}</span>
                        </div>
                        {/* 4. 列幅入力の修正: 専用コンポーネントを使用 */}
                        <ColumnWidthInput 
                          colId={col.id} 
                          width={col.width} 
                          onUpdate={updateColumnWidthState} 
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 px-1">リストをドラッグ＆ドロップして列の順番を入れ替えられます。</p>
                </div>
              )}

              {/* --- デザイン・UI設定 --- */}
              {activeTab === 'highlight' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Palette size={12}/> ヘッダーの色</label>
                    <div className="flex flex-wrap gap-2">
                      {[{ name: 'Navy', color: '#1e293b' }, { name: 'Indigo', color: '#312e81' }, { name: 'Slate', color: '#334155' }, { name: 'Emerald', color: '#064e3b' }].map(c => (
                        <button key={c.name} onClick={() => setDisplaySettings({...displaySettings, headerColor: c.color})} className={`w-8 h-8 rounded-lg border-2 transition-all ${displaySettings.headerColor === c.color ? 'border-sky-500 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`} style={{ backgroundColor: c.color }} title={c.name} />
                      ))}
                      <label className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${!['#1e293b', '#312e81', '#334155', '#064e3b'].includes(displaySettings.headerColor) ? 'border-sky-500 scale-105 shadow-md bg-white' : 'border-slate-200 bg-slate-100 hover:bg-slate-200'}`} title="カスタムカラー">
                        <Pipette size={14} className="text-slate-500" />
                        <input type="color" value={displaySettings.headerColor} onChange={(e) => setDisplaySettings({...displaySettings, headerColor: e.target.value})} className="opacity-0 absolute w-0 h-0" />
                      </label>
                    </div>
                  </div>

                  {/* 罫線と文字色のカスタマイズを追加 */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Grid size={12}/> 罫線の色</label>
                      <div className="flex items-center gap-2">
                         <input type="color" value={displaySettings.borderColor} onChange={(e) => setDisplaySettings({...displaySettings, borderColor: e.target.value})} className="w-10 h-8 rounded border border-slate-200 cursor-pointer" />
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-full text-center">{displaySettings.borderColor}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Type size={12}/> 文字の色</label>
                      <div className="flex items-center gap-2">
                         <input type="color" value={displaySettings.textColor} onChange={(e) => setDisplaySettings({...displaySettings, textColor: e.target.value})} className="w-10 h-8 rounded border border-slate-200 cursor-pointer" />
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-full text-center">{displaySettings.textColor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Palette size={12}/> ハイライト行の背景色</label>
                    <div className="flex items-center gap-2">
                       <input type="color" value={displaySettings.highlightColor} onChange={(e) => setDisplaySettings({...displaySettings, highlightColor: e.target.value})} className="w-10 h-8 rounded border border-slate-200 cursor-pointer" />
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded w-full text-center">{displaySettings.highlightColor}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Layers size={12}/> 行間の密度</label>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      {['standard', 'compact', 'x-compact'].map(d => (
                        <button key={d} onClick={() => setDisplaySettings({...displaySettings, rowDensity: d})} className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${displaySettings.rowDensity === d ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                          {d === 'standard' ? '標準' : d === 'compact' ? 'コンパクト' : '最小'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    <label className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl cursor-pointer hover:bg-indigo-100 transition-all">
                      <span className="font-bold text-indigo-900 text-[11px]">特定の行を自動ハイライト</span>
                      <div onClick={() => setDisplaySettings(prev => ({ ...prev, autoHighlightEnabled: !prev.autoHighlightEnabled, highlightConditions: { ...prev.highlightConditions, active: !prev.autoHighlightEnabled } }))} className={`w-10 h-5 rounded-full relative transition-all ${displaySettings.autoHighlightEnabled ? 'bg-indigo-600 shadow-indigo-200 shadow-md' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow transition-all ${displaySettings.autoHighlightEnabled ? 'left-6' : 'left-1'}`} />
                      </div>
                    </label>

                    {displaySettings.autoHighlightEnabled && (
                      <div className="bg-white border border-indigo-100 rounded-lg p-3 space-y-3 animate-in fade-in">
                        {/* 指示1: 「5. ハイライト条件設定」のタイトルを削除 */}
                        <FilterForm 
                          conditions={displaySettings.highlightConditions} 
                          setConditions={(fn) => setDisplaySettings(prev => {
                            const newCond = typeof fn === 'function' ? fn(prev.highlightConditions) : fn;
                            return { ...prev, highlightConditions: { ...newCond, active: true } };
                          })} 
                          // リセットボタン追加
                          onReset={() => setDisplaySettings(prev => ({ ...prev, highlightConditions: { ...defaultHighlightConditions, active: true } }))}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
             
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0">
              <button onClick={() => setSettingsOpen(false)} className="w-full py-3 bg-[#0f172a] text-white rounded-xl shadow-lg font-bold hover:bg-slate-800 transition-all">設定を閉じて適用</button>
            </div>
          </div>
        )}
      </div>

      {/* フッター */}
      <footer className="h-10 bg-[#0f172a] border-t border-white/10 flex items-center justify-between px-4 text-[10px] text-white/50 z-30 shrink-0">
        <div className="flex gap-5 items-center">
          {/* <span className="flex items-center gap-1.5 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> システム稼働中</span> */}
          <div className="h-3 w-px bg-white/20"></div>
          
          <div className="flex items-center gap-2">
            <span>表示件数:</span>
            <select 
              value={itemsPerPage} 
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
              className="bg-[#1e293b] text-white border border-white/20 rounded px-1 py-0.5 outline-none text-[10px]"
            >
              {[20, 50, 100].map(n => <option key={n} value={n}>{n}件</option>)}
            </select>
          </div>

          <div className="h-3 w-px bg-white/20"></div>
          <span>全 {totalItems} 件中 {totalItems > 0 ? `${startIndex + 1} - ${Math.min(startIndex + itemsPerPage, totalItems)}` : '0'} 件を表示</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-[#1e293b] rounded p-0.5 border border-white/10">
            <button 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-all"
            >
              <ChevronsLeft size={14} />
            </button>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 font-mono font-medium text-white/80 min-w-[60px] text-center">
              Page {currentPage} / {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-all"
            >
              <ChevronRight size={14} />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 rounded hover:bg-white/10 disabled:opacity-30 transition-all"
            >
              <ChevronsRight size={14} />
            </button>
          </div>
          <span className="opacity-50 hidden sm:inline">Data viewer</span>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .cursor-col-resize { cursor: col-resize; }
        #table-scroll-parent::-webkit-scrollbar { width: 10px; height: 10px; }
        #table-scroll-parent::-webkit-scrollbar-track { background: #f8fafc; }
        #table-scroll-parent::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 3px solid #f8fafc; }
        #table-scroll-parent::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
        .animate-in { animation: fadeIn 0.15s ease-out; }
      `}} />
    </div>
  );
};

export default App;