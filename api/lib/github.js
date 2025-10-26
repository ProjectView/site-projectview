/**
 * GitHub API utilities for committing and pushing changes
 */

export async function commitAndPush(files, commitMessage) {
  const { Octokit } = await import('@octokit/rest');

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
  });

  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  try {
    // Get current branch default ref (usually main/master)
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: 'heads/main'
    });

    const baseSha = refData.object.sha;

    // Get commit data
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: baseSha
    });

    const treeData = [];

    // Process each file
    for (const file of files) {
      const blobData = await octokit.git.createBlob({
        owner,
        repo,
        content: file.content,
        encoding: 'utf-8'
      });

      treeData.push({
        path: file.path,
        mode: '100644',
        type: 'blob',
        sha: blobData.data.sha
      });
    }

    // Create new tree
    const { data: newTreeData } = await octokit.git.createTree({
      owner,
      repo,
      tree: treeData,
      base_tree: commitData.tree.sha
    });

    // Create new commit
    const { data: newCommitData } = await octokit.git.createCommit({
      owner,
      repo,
      message: commitMessage,
      tree: newTreeData.sha,
      parents: [baseSha]
    });

    // Update reference
    await octokit.git.updateRef({
      owner,
      repo,
      ref: 'heads/main',
      sha: newCommitData.sha
    });

    return {
      success: true,
      commitSha: newCommitData.sha,
      message: `Committed with SHA: ${newCommitData.sha}`
    };
  } catch (error) {
    console.error('GitHub commit error:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}
