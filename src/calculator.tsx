import React, { useState, useMemo } from 'react';
import { SUBJUGATION_LIST, CHEHWA_MAX } from './types';

const AccuracyCalculator: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<number>(25);
  const [stats, setStats] = useState({
    charAcc: 0, monsterAcc: 0, somaAcc: 0, charSkillAcc: 0, etcAcc: 0
  });
  const [chehwa, setChehwa] = useState({ combat: 0, focus: 0, transcend: 0 });
  const [isSealingWar, setIsSealingWar] = useState<boolean>(false);
  const [heroicStone, setHeroicStone] = useState<number>(0);
  const [legendaryStone, setLegendaryStone] = useState<number>(0);

  // --- 팝업 상태 관리 (클릭 시 토글) ---
  const [showChehwaInfo, setShowChehwaInfo] = useState(false);
  const [showStoneInfo, setShowStoneInfo] = useState(false);

  const handleRedirect = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const extraStats = useMemo(() => {
    // 영웅: 명중 +2 / 전설: 명중 +3 (스킬 명중은 각각 +1, +2) [cite: 47, 75]
    const stoneAcc = (heroicStone * 2) + (legendaryStone * 3);
    const stoneSkillAcc = (heroicStone * 1) + (legendaryStone * 2);
    const stoneCount = heroicStone + legendaryStone;
    const totalChehwaAcc = chehwa.combat + chehwa.focus + chehwa.transcend;
    return { stoneAcc, stoneSkillAcc, stoneCount, totalChehwaAcc };
  }, [heroicStone, legendaryStone, chehwa]);

  const result = useMemo(() => {
    const target = SUBJUGATION_LIST.find(s => s.level === selectedLevel);
    if (!target) return null;
    const totalAcc = stats.charAcc + stats.monsterAcc + stats.somaAcc + stats.etcAcc + (isSealingWar ? 5 : 0) + extraStats.stoneAcc + extraStats.totalChehwaAcc;
    const totalSkillAcc = stats.charSkillAcc + stats.monsterAcc + extraStats.stoneSkillAcc;
    return { totalAcc, totalSkillAcc, isAccOk: totalAcc >= target.reqAccuracy, isSkillAccOk: totalSkillAcc >= target.reqSkillAccuracy, reqAcc: target.reqAccuracy, reqSkillAcc: target.reqSkillAccuracy };
  }, [stats, isSealingWar, selectedLevel, extraStats]);

  const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleChehwaChange = (type: keyof typeof CHEHWA_MAX, value: number) => {
    const cappedValue = Math.min(value, CHEHWA_MAX[type]);
    setChehwa(prev => ({ ...prev, [type]: cappedValue < 0 ? 0 : cappedValue }));
  };

  return (
    <div style={{ maxWidth: '1280px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <header style={navBarStyle}>
        <div style={navTitleStyle}>🏹 프라시아 전기 명중 계산기 <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}>by 홍차</span></div>
        <div style={navButtonGroupStyle}>
          <button style={navButtonStyle} onClick={() => handleRedirect('https://creators.nexon.com/kr/s/BLACKTEA#0604')}>🍵 홍차 후원하기</button>
          <button style={navButtonStyle} onClick={() => handleRedirect('https://www.youtube.com/channel/UCuxAaV9g4ooqHqoqM99EdPg')}>📺 홍차 구독하기</button>
          <button style={navInquiryStyle} onClick={() => handleRedirect('https://open.kakao.com/o/sbSBrKXf')}>💬 우르르 가입문의</button>
        </div>
      </header>

      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <label>목표 토벌 레벨: </label>
          <select value={selectedLevel} onChange={(e) => setSelectedLevel(Number(e.target.value))} style={{ padding: '8px', borderRadius: '5px' }}>
            {SUBJUGATION_LIST.map(item => (
              <option key={item.level} value={item.level}>{item.level} 토벌</option>
            ))}
          </select>
        </div>

        <section style={unifiedSectionStyle}>
          <h3 style={sectionTitleStyle}>🎯 명중 스탯 정보 입력</h3>
          
          <div style={horizontalLayoutStyle}>
            {/* 1. 기본 스탯 */}
            <div style={flexColumnStyle}>
              <h4 style={subTitleStyle}>📊 기본 스탯</h4>
              {['charAcc', 'monsterAcc', 'somaAcc', 'charSkillAcc'].map((field) => (
                <div key={field} style={inputRowStyle}>
                  <label style={labelStyle}>{getFieldName(field)}</label>
                  <input type="number" name={field} onChange={handleStatChange} style={inputStyle} />
                </div>
              ))}
            </div>

            {/* 2. 체화 명중 (클릭 팝업 적용) */}
            <div style={flexColumnStyle}>
              <h4 style={subTitleStyle}>
                🧬 체화 명중 
                <button onClick={() => setShowChehwaInfo(!showChehwaInfo)} style={infoBtnStyle}>i</button>
                {showChehwaInfo && (
                  <div style={tooltipStyle}>
                    <strong>체화 만렙 최대치</strong><br/>
                    전투: {CHEHWA_MAX.combat} | 집중: {CHEHWA_MAX.focus} | 초월: {CHEHWA_MAX.transcend}
                  </div>
                )}
              </h4>
              {(Object.keys(CHEHWA_MAX) as Array<keyof typeof CHEHWA_MAX>).map((k) => (
                <div key={k} style={{ marginBottom: '12px' }}>
                  <div style={inputRowStyle}>
                    <label style={labelStyle}>{getChehwaName(k)}</label>
                    <input type="number" value={chehwa[k]} max={CHEHWA_MAX[k]} onChange={(e) => handleChehwaChange(k, Number(e.target.value))} style={inputStyle} />
                  </div>
                  <label style={{ fontSize: '0.8rem', cursor: 'pointer', display: 'block', textAlign: 'right', marginTop: '2px' }}>
                    <input type="checkbox" checked={chehwa[k] === CHEHWA_MAX[k]} onChange={(e) => setChehwa(prev => ({ ...prev, [k]: e.target.checked ? CHEHWA_MAX[k] : 0 }))} /> 영끌 적용
                  </label>
                </div>
              ))}
            </div>

            {/* 3. 추가 옵션 (클릭 팝업 추가) */}
            <div style={flexColumnStyle}>
              <h4 style={subTitleStyle}>
                💎 추가 옵션
                <button onClick={() => setShowStoneInfo(!showStoneInfo)} style={infoBtnStyle}>i</button>
                {showStoneInfo && (
                  <div style={tooltipStyle}>
                    <strong>주문석 명중 정보</strong><br/>
                    영웅(회색): 명중 +2 / 스명 +1<br/>
                    전설(회색): 명중 +3 / 스명 +2
                  </div>
                )}
              </h4>
              <div style={{ marginBottom: '15px' }}><label style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}><input type="checkbox" checked={isSealingWar} onChange={() => setIsSealingWar(!isSealingWar)} /> 봉인전 참여 (명중 +5)</label></div>
              <div style={inputRowStyle}><label style={labelStyle}>영웅 주문석</label><input type="number" value={heroicStone} onChange={(e) => setHeroicStone(Number(e.target.value))} style={inputStyle} /></div>
              <div style={inputRowStyle}><label style={labelStyle}>전설 주문석</label><input type="number" value={legendaryStone} onChange={(e) => setLegendaryStone(Number(e.target.value))} style={inputStyle} /></div>
              <div style={{ fontSize: '0.75rem', color: extraStats.stoneCount > 20 ? 'red' : '#666', marginBottom: '15px', textAlign: 'right' }}>주문석 개수: {extraStats.stoneCount} / 20</div>
              <div style={inputRowStyle}><label style={labelStyle}>기타 명중</label><input type="number" name="etcAcc" onChange={handleStatChange} style={inputStyle} placeholder="기타" /></div>
            </div>
          </div>
        </section>

        <hr style={{ margin: '40px 0', border: '0', borderTop: '1px solid #eee' }} />

        {result && (
          <div style={{ padding: '25px', backgroundColor: (extraStats.stoneCount > 20) ? '#fff0f0' : '#f0f7ff', borderRadius: '12px', border: '1px solid #cce5ff', textAlign: 'center' }}>
            <h3>📋 {selectedLevel}토벌 분석 결과</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div><p style={{ margin: '5px 0' }}>최종 명중</p><h2 style={{ color: result.isAccOk ? '#2ecc71' : '#e74c3c', margin: '0' }}>{result.totalAcc} / {result.reqAcc}</h2></div>
              <div><p style={{ margin: '5px 0' }}>최종 스킬 명중</p><h2 style={{ color: result.isSkillAccOk ? '#2ecc71' : '#e74c3c', margin: '0' }}>{result.totalSkillAcc} / {result.reqSkillAcc}</h2></div>
            </div>
            <div style={{ marginTop: '20px' }}>
              {extraStats.stoneCount > 20 ? <strong style={{ color: 'red' }}>주문석은 최대 20개까지만 가능합니다!</strong> :
               (result.isAccOk && result.isSkillAccOk) ? <strong style={{ color: '#27ae60', fontSize: '1.3rem' }}>✨ 토벌 가능! 어서 가세요!</strong> :
               <strong style={{ color: '#e67e22', fontSize: '1.1rem' }}>⚠️ 명중이 부족합니다. 더 보강하세요!</strong>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- 스타일 객체 (기존 유지 및 최적화) ---
const navBarStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', backgroundColor: '#2c3e50', color: '#ecf0f1', marginBottom: '20px', borderRadius: '0 0 10px 10px' };
const navTitleStyle: React.CSSProperties = { fontSize: '1.1rem', fontWeight: 'bold' };
const navButtonGroupStyle: React.CSSProperties = { display: 'flex', gap: '8px' };
const navButtonStyle: React.CSSProperties = { padding: '8px 12px', border: 'none', borderRadius: '5px', backgroundColor: '#34495e', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' };
const navInquiryStyle: React.CSSProperties = { ...navButtonStyle, backgroundColor: '#f1c40f', color: '#2c3e50', fontWeight: 'bold' };
const unifiedSectionStyle: React.CSSProperties = { padding: '25px', border: '1px solid #e0e0e0', borderRadius: '15px', backgroundColor: '#ffffff', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' };
const sectionTitleStyle: React.CSSProperties = { marginTop: '0', marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #f0f0f0', color: '#333', textAlign: 'center' };
const horizontalLayoutStyle: React.CSSProperties = { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' };
const flexColumnStyle: React.CSSProperties = { flex: '1', minWidth: '260px', display: 'flex', flexDirection: 'column', padding: '15px', backgroundColor: '#fdfdfd', borderRadius: '10px', border: '1px solid #f5f5f5', position: 'relative' };
const subTitleStyle: React.CSSProperties = { marginTop: '0', marginBottom: '15px', fontSize: '1rem', color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '4px solid #3498db', paddingLeft: '10px' };
const inputRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' };
const labelStyle: React.CSSProperties = { fontSize: '0.9rem', fontWeight: '500', color: '#555' };
const inputStyle: React.CSSProperties = { width: '70px', padding: '7px', borderRadius: '5px', border: '1px solid #ddd', fontSize: '0.9rem', textAlign: 'center' };
const infoBtnStyle: React.CSSProperties = { width: '18px', height: '18px', borderRadius: '50%', border: 'none', backgroundColor: '#3498db', color: 'white', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', justifyContent: 'center', alignItems: 'center' };
const tooltipStyle: React.CSSProperties = { position: 'absolute', top: '45px', left: '15px', backgroundColor: '#333', color: '#fff', padding: '12px', borderRadius: '8px', fontSize: '0.8rem', zIndex: 10, width: '200px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', lineHeight: '1.5' };

const getFieldName = (n: string) => ({ charAcc: '캐릭터 명중', monsterAcc: '일몬 명중', somaAcc: '소마 명중', charSkillAcc: '캐릭터 스킬명중'}[n] || n);
const getChehwaName = (n: string) => ({ combat: '전투체화', focus: '집중체화', transcend: '초월체화' }[n] || n);

export default AccuracyCalculator;