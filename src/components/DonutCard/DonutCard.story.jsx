import React from 'react';
import { storiesOf } from '@storybook/react';
import { text, select, object } from '@storybook/addon-knobs';

import { COLORS, CARD_SIZES } from '../../constants/LayoutConstants';
import { getCardMinSize } from '../../utils/componentUtilityFunctions';

import DonutCard from './DonutCard';

storiesOf('DonutCard (Experimental)', module).add('basic', () => {
  const size = select('size', Object.keys(CARD_SIZES), CARD_SIZES.MEDIUM);
  return (
    <div style={{ width: `${getCardMinSize('lg', size).x}px`, margin: 20 }}>
      <DonutCard
        title={text('title', 'Alerts (last month)')}
        id="facility-temperature"
        content={object('content', {
          title: 'Alerts',
          data: [
            { label: 'Sev 3', value: 6, color: COLORS.RED },
            { label: 'Sev 2', value: 9, color: COLORS.YELLOW },
            { label: 'Sev 1', value: 18, color: COLORS.BLUE },
          ],
        })}
        breakpoint="lg"
        size={size}
      />
    </div>
  );
});