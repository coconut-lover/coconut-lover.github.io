export interface SubjugationData {
  level: number;
  reqAccuracy: number;
  reqSkillAccuracy: number;
}

export const SUBJUGATION_LIST: SubjugationData[] = [
  { level: 14, reqAccuracy: 720, reqSkillAccuracy: 410 },
  { level: 15, reqAccuracy: 780, reqSkillAccuracy: 440 },
  { level: 16, reqAccuracy: 840, reqSkillAccuracy: 480 },
  { level: 17, reqAccuracy: 900, reqSkillAccuracy: 500 },
  { level: 18, reqAccuracy: 960, reqSkillAccuracy: 540 },
  { level: 19, reqAccuracy: 1020, reqSkillAccuracy: 560 },
  { level: 20, reqAccuracy: 1100, reqSkillAccuracy: 620 },
  { level: 21, reqAccuracy: 1170, reqSkillAccuracy: 660 },
  { level: 22, reqAccuracy: 1240, reqSkillAccuracy: 700 },
  { level: 23, reqAccuracy: 1300, reqSkillAccuracy: 750 },
  { level: 24, reqAccuracy: 1370, reqSkillAccuracy: 800 },
  { level: 25, reqAccuracy: 1440, reqSkillAccuracy: 840 },
];

export interface SubjugationData {
  level: number;
  reqAccuracy: number;
  reqSkillAccuracy: number;
}

// 아퀴 체화 최대 명중 수치 (만렙 기준)
export const CHEHWA_MAX = {
  combat: 50,      // 전투체화
  focus: 23,       // 집중체화
  transcend: 3,    // 초월체화
};