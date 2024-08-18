import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';  // Import react-cookie hooks
import SliderButton from '../../components/SliderButton';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies(['language']);  // Manage the language cookie
  const [language, setLanguage] = useState(cookies.language || 'English');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Update the language state based on the cookie when the component mounts
    if (cookies.language) {
      setLanguage(cookies.language);
    }
  }, [cookies.language]);

  const handleSlideComplete = (path) => {
    navigate(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const selectLanguage = (lang) => {
    setLanguage(lang);
    setCookie('language', lang, { path: '/' });  // Save the selected language in a cookie
    setIsMenuOpen(false);
  };

  // Texts for different languages
  const texts = {
    English: {
      greeting: 'Hello, Ricky!',
      learningVocab: 'Learning Vocabulary',
      talkingInExample: 'Talking in Example Situation',
      freeTalk: 'Free Talk',
      description: 'How was your day? Talk with AI and Get better Korean',
    },
    Korean: {
      greeting: '안녕하세요, 리키!',
      learningVocab: '오늘의 어휘 학습',  // Updated text here
      talkingInExample: '예시 상황에서 대화하기',
      freeTalk: '자유 대화',
      description: '오늘 하루 어땠어요? AI와 대화하며 한국어 실력을 향상시키세요',
    },
    Japanese: {
      greeting: 'こんにちは、リッキーさん!',
      learningVocab: '語彙を学ぶ',
      talkingInExample: '例の状況で話す',
      freeTalk: '自由な話',
      description: '今日はどうでしたか？AIと話して日本語を上達させましょう',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>{texts[language].greeting} <span role="img" aria-label="clap">👏</span></h1>
        <div style={styles.languageSelector} onClick={toggleMenu}>
          {language} ▼
          {isMenuOpen && (
            <div style={styles.dropdownMenu}>
              <div style={styles.menuItem} onClick={() => selectLanguage('English')}>English</div>
              <div style={styles.menuItem} onClick={() => selectLanguage('Korean')}>한국어</div>
              <div style={styles.menuItem} onClick={() => selectLanguage('Japanese')}>日本語</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Top two cards side by side */}
      <div style={styles.topCardContainer}>
        <div style={styles.smallCard}>
          <div style={styles.cardTextContainer}>
            <div style={styles.cardTitle}>{texts[language].learningVocab}</div>
          </div>
          <SliderButton
            duration="1 min"
            circleColor="#FF5A5F"  // Red for the circle
            barColor="#333"        // Dark gray for the bar
            onComplete={() => handleSlideComplete('/voca')}
          />
        </div>
        <div style={styles.smallCard}>
          <div style={styles.cardTextContainer}>
            <div style={styles.cardTitle}>{texts[language].talkingInExample}</div>
          </div>
          <SliderButton
            duration="10 min"
            circleColor="#4A90E2"  // Blue for the circle
            barColor="#AAA"        // Light gray for the bar
            onComplete={() => handleSlideComplete('/Ex-Situation')}
          />
        </div>
      </div>
      
      {/* Bottom larger card centered under the top two */}
      <div style={styles.bottomCardContainer}>
        <div style={styles.largeCard}>
          <div style={styles.cardTextContainer}>
            <div style={styles.cardTitle}>{texts[language].freeTalk}</div>
            <div style={styles.cardDescription}>{texts[language].description}</div>
          </div>
          <SliderButton
            duration="10 min"
            circleColor="#FF69B4"  // Pink for the circle
            barColor="#888"        // Medium gray for the bar
            onComplete={() => handleSlideComplete('/free')}
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '400px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Arial', sans-serif",
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',  // To position dropdown menu correctly
  },
  header: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  languageSelector: {
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '5px 10px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '30px',
    right: '0',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    overflow: 'hidden',
    zIndex: 1000,
  },
  menuItem: {
    padding: '10px 15px',
    cursor: 'pointer',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#fff',
    transition: 'background-color 0.3s',
  },
  topCardContainer: {
    marginTop: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px',
  },
  bottomCardContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  smallCard: {
    width: '140px',  // Adjusted width to fit within the container
    backgroundColor: '#f0f0f0',
    borderRadius: '15px',
    padding: '15px',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '120px',
  },
  largeCard: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '150px',
  },
  cardTextContainer: {
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: '14px',
    color: '#666',
    marginTop: '5px',
  },
};

export default Home;