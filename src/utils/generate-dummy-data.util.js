export const generateDummyData = (count) => {
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
    { pod: 'Kingston', country: 'Jamaica' },
  ];
  const carNames = [
    'Toyota Prius',
    'Nissan Leaf',
    'Honda Fit',
    'Subaru Impreza',
    'Mazda CX-5',
    'Toyota RAV4',
    'Suzuki Swift',
    'Toyota Aqua',
    'Honda Vezel',
    'Nissan X-Trail',
  ];
  const statuses = ['完了', '未'];

  return Array.from({ length: count }, (_, i) => {
    const id = i + 1;
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const vessel = vessels[Math.floor(Math.random() * vessels.length)];
    const pol = pols[Math.floor(Math.random() * pols.length)];

    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    const carName = carNames[Math.floor(Math.random() * carNames.length)];

    // 日付生成 (2026年)
    const start = new Date('2026-01-01').getTime();
    const end = new Date('2026-05-30').getTime();
    const orderTime = start + Math.random() * (end - start);
    const orderDateObj = new Date(orderTime);
    const orderDate = orderDateObj.toISOString().split('T')[0];

    const etdTime = orderTime + (15 + Math.random() * 30) * 24 * 60 * 60 * 1000;
    const etdDateObj = new Date(etdTime);
    const etd = etdDateObj.toISOString().split('T')[0];

    let blDate = '';
    if (Math.random() > 0.15) {
      const blTime = etdTime + (2 + Math.random() * 5) * 24 * 60 * 60 * 1000;
      blDate = new Date(blTime).toISOString().split('T')[0];
    }

    const invCustoms = Math.random() > 0.1 ? `INV-C-${90000 + id}` : '';
    const flagDereg = Math.random() > 0.2 ? '完了' : '未';
    const flagOdo = Math.random() > 0.2 ? '完了' : '未';

    return {
      id,
      chassis: `ABC-${100000 + id}`,
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
      blDate,
    };
  });
};

// 台番号：custbody_sw_vin_no
// 受注番号：tranid
// 受注日付：trandate
// ORDERER(CONSIGNEE)：custbody_sw_ord_nm
// 船名・航海番号：custbody_sw_shp_vsl_no
// 積出港：custbody_sw_dep_port_cd
// ETD：custbody_sw_etd
// 荷揚港：custbody_sw_arv_port_cd
// 荷揚国：custbody_sw_destination_country
// 車名：custbody_sw_mdl
// 抹消完了：custbody_sw_status_completed_erasure
// ODO検査完了：custbody_sw_odo_completed_flag
// 通関インボイス番号：custbody_sw_custom_invoice_number
// S/I No：custbody_sw_si
// 売上インボイス番号：custbody_sw_sales_invoice_number
// B/L Issue Date：custbody_sw_bl_dt
