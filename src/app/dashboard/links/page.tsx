import React from 'react';

const LinksPage = () => {
  const userLinks = [
    { id: 1, title: 'Google', url: 'https://www.google.com' },
    { id: 2, title: 'GitHub', url: 'https://github.com' },
    { id: 3, title: 'Next.js', url: 'https://nextjs.org' },
  ];

  return (
    <div>
      <h1>User Links</h1>
      <ul>
        {userLinks.map((link) => (
          <li key={link.id}>
            <a href={link.url} target="_blank" rel="noopener noreferrer">
              {link.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LinksPage;