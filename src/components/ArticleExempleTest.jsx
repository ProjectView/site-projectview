import React from 'react';
import ArticleRenderer from './ArticleRenderer';
import exampleContent from '@/content/articles/exemple-article-test.md?raw';

const ArticleExempleTest = () => {
  return <ArticleRenderer markdownContent={exampleContent} />;
};

export default ArticleExempleTest;
