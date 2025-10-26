import React from 'react';
import ArticleRenderer from './ArticleRenderer';
import articleContent from '@/content/articles/test-article-2025-10-26.md?raw';

const TestArticle20251026 = () => {
  return <ArticleRenderer markdownContent={articleContent} />;
};

export default TestArticle20251026;
