import { Project } from "../../types/project";
import { AurumNova } from "./aurum-nova/aurum-nova";
import { Dune } from "./dune/dune";
import { EcoCleaner } from "./eco-cleaner/eco-cleaner";
import { FamilyTechDrive } from "./family-tech-drive/family-tech-drive";
import { ParisMusic2024 } from "./paris-music-2024/paris-music-2024";
import { Fooh } from "./fooh/fooh";
import { KarminCorpLecReveal } from "./karmin-corp-lec-reveal/karmin-corp-lec-reveal";
import { LimovaMovali } from "./limova-movali/limova-movali";
import { SpidermanTimefreeze } from "./spiderman-timefreeze/spiderman-timefreeze";
import { Lyner } from "./lyner/lyner";
import { MrHelp } from "./mr-help/mr-help";
import { Dals } from "./dals/dals";
import { Yassencore } from "./yassencore/yassencore";
import { PixelBreak } from "./pixel-break/pixel-break";
import { Trybz } from "./trybz/trybz";

const allProjects: Project[] = [
  AurumNova,
  Dune,
  EcoCleaner,
  FamilyTechDrive,
  ParisMusic2024,
  Fooh,
  KarminCorpLecReveal,
  LimovaMovali,
  SpidermanTimefreeze,
  Lyner,
  MrHelp,
  Dals,
  Yassencore,
  PixelBreak,
  Trybz,
];

export const allProjectsSortedByPriority: Project[] = allProjects
  .slice()
  .sort((a, b) => a.priority - b.priority);

export const getProjectById = (id: string): Project | undefined => {
  return allProjects.find((project) => project.id === id);
};
