const SkipToContent = () => {
  const handleSkip = () => {
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault();
        handleSkip();
      }}
      className="skip-to-content"
      style={{
        position: 'fixed',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100000,
        padding: 'var(--spacing-3) var(--spacing-6)',
        background: 'var(--color-primary)',
        color: 'var(--color-primary-foreground)',
        borderRadius: 'var(--radius-lg)',
        fontWeight: 600,
        fontSize: '0.875rem',
        textDecoration: 'none',
        transition: 'top 0.3s ease',
        boxShadow: 'var(--shadow-lg)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '1rem';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-100px';
      }}
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
