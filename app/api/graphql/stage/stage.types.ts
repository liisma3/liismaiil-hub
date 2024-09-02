import { PROFILE_STATUS_ENUM } from "@/api/graphql/profile/profile.types";

export type SprintStateProps = {
  sprints: SprintType[],
  spaceGridsSelected: GridJsoned[],
  gridSelected: GridJsoned,
  stageSelected: StageTypeData,
  evalIndex: number,
  orderedAyahsContext: Ayah[],
  shuffeledAyahsContext: Ayah[],
  shuffeledFirstAyahsContext: Ayah[],
  gridIndexContext: number,
  hideNbContext: boolean,
  faultsNbContext: number,
  correctsNbContext: number,
  spaceSprint: SprintType,
  spaceStage: StageTypeData,
  validStages: [string],
  evalContext: EVAL_STATE,
  validContext: boolean,
}

export enum EVAL_STATE {
  EVAL = 'EVAL',
  ORDER = 'ORDER',
  CLICK = 'CLICK',
}

export type SprintType = {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  author: string;
  stages: [StageTypeData]
}

export type PromoteRateType = {
  guest: number;
  rate: number;
};
export type GridType = {
  id: number;
  arabName: string;
  title: string;
  souraNb: number;
  souraName: string;
  ayahs: Ayah[];
  grid: number;
  group: number;
};
export type GridBrut = {
  id: number;
  arabName: string;
  author: string;
  createdAt: string;
  description: string;
  title: string;
  souraNb: number;
  souraName: string;
  ayahs: [Ayah[]];
  grid: number;
  group: [number];
};
export type GridJsoned = {
  id: number;
  arabName: string;
  title: string;
  souraNb: number;
  souraName: string;
  ayahs: string;
  grid: number;
  group: number;
};

export type GridAyahsJson = {
  id: number;
  arabName: string;
  title: string;
  souraNb: number;
  souraName: string;
  ayahs: string;
  grid: number;
  group: number | [number];
};
export type GuestType = {
  tokenId: number; //112
  flag: string;
  price?: number;
  collaboratorId: string;
  host: number;
  password: string;
  status: PROFILE_STATUS_ENUM;
  enrollmentStatus?: string;
  startDate?: string;
  endDate?: string;
  stages?: [string];
  sprints?: [string];
  country?: [string];
};
export type AddGuestInput = GuestType;
export type UpdateGuestInput = GuestType;
export type GetGridsBySouraNbInput = {
  author: string,
  souraNb: number
}
export type PromoteStageInput = {
  stage: number,
  category: STAGE_CATEGORY_ENUM
};

export type StageTypeData = {
  id: number;
  title: string;
  published: boolean;
  authorId: number;
  grids: [String];
  categories: [String];
  sprints: [String];
  createdAt?: string;
}


export type StagePrismaType = {
  id: number;
  stageId: number;
  createdAt: string;
  souraName: string;
  souraNb: number;
  grid: number;
  startOn: string
  createdById: string;
  guests: GuestPrismaType[];
  ayahs: AyahPrismaType[];
}
export type AyahPrismaType = {
  index: number;
  juz: number;
  order: number;
  text: string;
  stages: StagePrismaType[]
  slice?: string;
};
export type GuestPrismaType = {
  id: number;
  tokenId: number;
  flag: string;
  collaboratorId: string;
  host: number;
  createdAt: string;
  country: string;
  password: string;
  onLine: boolean;
  endDate: string;
  stages: StagePrismaType[];
  sprints: SprintPrismaType[];
};

export type SprintPrismaType = {
  id: number;
  sprintId: number;
  createdAt: string;
  souraName: string;
  souraNb: number;
  grid: number;
  startOn: string
  createdById: string;
  guests: GuestPrismaType[]
  stages: StagePrismaType[]
}
export type AyahTabletType = {
  order: number;
  text: string;
  juz: number;
  slice?: string;
};
export type Ayah = {
  id: number;
  juz: number;
  order: number;
  text: string;
}
export enum STAGE_CATEGORY_ENUM {
  SOBH = "SOBH",
  DOHR = 'DOHR',
  ASR = 'ASR',
  MAGHRB = 'MAGHRB',
  ICHA = 'ICHA',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}