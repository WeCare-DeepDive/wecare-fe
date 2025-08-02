// constants/iconTypes.js
import IconCapsule from '@assets/Iconsvg/IconButtons/IconCapsuleBtn.svg';
import IconMeal from '@assets/Iconsvg/IconButtons/IconMealBtn.svg';
import IconWalk from '@assets/Iconsvg/IconButtons/IconWalkBtn.svg';
import IconNote from '@assets/Iconsvg/IconButtons/IconNoteBtn.svg';

export const ICON_TYPES = {
  MEDICATION: {
    type: 'MEDICATION',
    Icon: IconCapsule,
    defaultColor: '#ff6b6b',
    label: '약',
  },
  SUPPLEMENT: {
    type: 'SUPPLEMENT',
    Icon: IconMeal,
    defaultColor: '#ffd700',
    label: '식사',
  },
  ACTIVITY: {
    type: 'ACTIVITY',
    Icon: IconWalk,
    defaultColor: '#51cf66',
    label: '운동',
  },
  CUSTOM: {
    type: 'CUSTOM',
    Icon: IconNote,
    defaultColor: '#339af0',
    label: '자유',
  },
};

export const typeIcons = Object.keys(ICON_TYPES);