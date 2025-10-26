import React from 'react';
import ArticleRenderer from './ArticleRenderer';
import articleContent from '@/content/articles/mon-premier-article.md?raw';

const MonPremierArticle = () => {
  return <ArticleRenderer markdownContent={articleContent} />;
};

export default MonPremierArticle;
