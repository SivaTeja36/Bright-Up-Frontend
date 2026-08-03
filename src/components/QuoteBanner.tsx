import { useEffect, useState } from 'react';
import { Box, Typography, IconButton, useTheme } from '@mui/material';
import { RefreshCcw, Quote, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuoteType {
  text: string;
  author: string;
}

const QUOTES: QuoteType[] = [
  { text: 'Education is the most powerful weapon which you can use to change the world.', author: 'Nelson Mandela' },
  { text: 'The beautiful thing about learning is that no one can take it away from you.', author: 'B.B. King' },
  { text: 'Live as if you were to die tomorrow. Learn as if you were to live forever.', author: 'Mahatma Gandhi' },
  { text: 'The expert in anything was once a beginner.', author: 'Helen Hayes' },
  { text: 'Intelligence plus character — that is the goal of true education.', author: 'Martin Luther King Jr.' },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  { text: 'The more that you read, the more things you will know. The more that you learn, the more places you will go.', author: 'Dr. Seuss' },
  { text: 'Education is not preparation for life; education is life itself.', author: 'John Dewey' },
  { text: 'The mind is not a vessel to be filled, but a fire to be kindled.', author: 'Plutarch' },
  { text: 'Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.', author: 'Pelé' },
  { text: 'An investment in knowledge pays the best interest.', author: 'Benjamin Franklin' },
  { text: 'Change is the end result of all true learning.', author: 'Leo Buscaglia' },
  { text: 'Teaching is the one profession that creates all other professions.', author: 'Unknown' },
  { text: 'The roots of education are bitter, but the fruit is sweet.', author: 'Aristotle' },
  { text: 'Develop a passion for learning. If you do, you will never cease to grow.', author: 'Anthony J. D\u2019Angelo' },
  { text: 'A person who never made a mistake never tried anything new.', author: 'Albert Einstein' },
  { text: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.', author: 'Brian Herbert' },
  { text: 'Knowledge is power. Information is liberating.', author: 'Kofi Annan' },
  { text: 'The great aim of education is not knowledge but action.', author: 'Herbert Spencer' },
  { text: 'You don\u2019t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { text: 'Education breeds confidence. Confidence breeds hope. Hope breeds peace.', author: 'Confucius' },
  { text: 'The beautiful thing about learning is nobody can take it away from you.', author: 'B.B. King' },
  { text: 'What we learn with pleasure we never forget.', author: 'Alfred Mercier' },
  { text: 'It is the supreme art of the teacher to awaken joy in creative expression and knowledge.', author: 'Albert Einstein' },
];

const ROTATE_INTERVAL = 9000;

const getRandomQuote = (excludeIndex?: number): { quote: QuoteType; index: number } => {
  let index = Math.floor(Math.random() * QUOTES.length);
  if (excludeIndex !== undefined && QUOTES.length > 1) {
    while (index === excludeIndex) {
      index = Math.floor(Math.random() * QUOTES.length);
    }
  }
  return { quote: QUOTES[index], index };
};

const QuoteBanner = () => {
  const theme = useTheme();
  const [quote, setQuote] = useState<QuoteType>(() => getRandomQuote().quote);

  const refreshQuote = () => {
    setQuote((prev) => {
      const prevIndex = QUOTES.indexOf(prev);
      return getRandomQuote(prevIndex).quote;
    });
  };

  useEffect(() => {
    const interval = setInterval(refreshQuote, ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        p: { xs: 3, sm: 4 },
        background: theme.palette.gradient?.brand || 'linear-gradient(120deg, #1D4ED8 0%, #2563EB 45%, #0EA5E9 100%)',
        color: '#FFFFFF',
        mb: 4,
        boxShadow: '0px 12px 40px rgba(37, 99, 235, 0.35)',
      }}
    >
      {/* Decorative floating shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          right: -40,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.12)',
          filter: 'blur(2px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -70,
          left: '30%',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.10)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: -30,
          width: 80,
          height: 80,
          transform: 'rotate(45deg)',
          background: 'rgba(255, 255, 255, 0.08)',
        }}
      />

      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', minWidth: 0 }}>
          <Box
            sx={{
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              p: 1.5,
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(4px)',
              flexShrink: 0,
            }}
          >
            <Quote size={24} />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontWeight: 700,
                letterSpacing: '0.14em',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 0.5,
              }}
            >
              <Sparkles size={14} /> Daily Inspiration
            </Typography>
            <Box sx={{ position: 'relative', minHeight: { xs: 64, sm: 56 } }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={quote.text}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  <Typography
                    variant="h6"
                    component="p"
                    sx={{
                      fontWeight: 600,
                      lineHeight: 1.45,
                      textShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
                    }}
                  >
                    &ldquo;{quote.text}&rdquo;
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontWeight: 600,
                    }}
                  >
                    — {quote.author}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
          </Box>
        </Box>

        <motion.div whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}>
          <IconButton
            onClick={refreshQuote}
            sx={{
              color: 'white',
              background: 'rgba(255, 255, 255, 0.18)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(4px)',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.32)',
              },
            }}
            aria-label="Next quote"
          >
            <RefreshCcw size={20} />
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  );
};

export default QuoteBanner;
