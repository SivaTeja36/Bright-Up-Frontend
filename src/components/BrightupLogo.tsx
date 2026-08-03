import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';

type SizeValue = number | Record<string, number>;

interface BrightupLogoProps {
  iconHeight?: SizeValue;
  iconWidth?: SizeValue;
  textHeight?: SizeValue;
  textWidth?: SizeValue;
  gap?: number;
  color?: 'white' | 'dark';
  textFill?: boolean;
  sx?: BoxProps['sx'];
}

const BrightupLogo = ({
  iconHeight = 36,
  iconWidth,
  textHeight = 26,
  textWidth,
  gap = 1.5,
  color = 'white',
  textFill = false,
  sx,
}: BrightupLogoProps) => {
  const filter = color === 'dark' ? 'brightness(0)' : 'none';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap, ...sx }}>
      <Box
        component="img"
        src="/images/favicon.png"
        alt="Brightup icon"
        sx={{
          height: iconWidth ? 'auto' : iconHeight,
          width: iconWidth ?? (textFill ? iconHeight : 'auto'),
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
          flexShrink: 0,
          filter,
        }}
      />
      {textFill ? (
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src="/images/brightup-text.png"
            alt="Brightup"
            sx={{
              width: '100%',
              maxWidth: '100%',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              filter,
            }}
          />
        </Box>
      ) : (
        <Box
          component="img"
          src="/images/brightup-text.png"
          alt="Brightup"
          sx={{
            height: textWidth ? 'auto' : textHeight,
            width: textWidth ?? 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
            flexShrink: 0,
            filter,
          }}
        />
      )}
    </Box>
  );
};

export default BrightupLogo;
