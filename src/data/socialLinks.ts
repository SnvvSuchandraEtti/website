export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: 'social' | 'coding' | 'professional' | 'creative';
  color?: string;
}

export const socialLinks: SocialLink[] = [
  // Professional
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/suchandra-etti',
    icon: 'linkedin',
    category: 'professional',
    color: '#0A66C2'
  },
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/SnvvSuchandraEtti',
    icon: 'github',
    category: 'professional',
    color: '#181717'
  },
  {
    id: 'twitter',
    name: 'Twitter',
    url: 'https://twitter.com/snvvs369',
    icon: 'twitter',
    category: 'social',
    color: '#1DA1F2'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    url: 'https://www.instagram.com/suchandra369',
    icon: 'instagram',
    category: 'social',
    color: '#E4405F'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    url: 'https://www.youtube.com/@snvvs369/videos',
    icon: 'youtube',
    category: 'creative',
    color: '#FF0000'
  },
  {
    id: 'facebook',
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=100070206241754',
    icon: 'facebook',
    category: 'social',
    color: '#1877F2'
  },
  
  // Coding Platforms
  {
    id: 'leetcode',
    name: 'LeetCode',
    url: 'https://leetcode.com/u/snvvsuchandraetti/',
    icon: 'code',
    category: 'coding',
    color: '#FFA116'
  },
  {
    id: 'hackerrank',
    name: 'HackerRank',
    url: 'https://www.hackerrank.com/profile/22a91a0570',
    icon: 'terminal',
    category: 'coding',
    color: '#00EA64'
  },
  {
    id: 'codechef',
    name: 'CodeChef',
    url: 'https://www.codechef.com/users/suchandra369',
    icon: 'chef-hat',
    category: 'coding',
    color: '#5B4638'
  },
  {
    id: 'codeforces',
    name: 'Codeforces',
    url: 'https://codeforces.com/profile/snvvs369',
    icon: 'code-2',
    category: 'coding',
    color: '#1F8ACB'
  },
  {
    id: 'geeksforgeeks',
    name: 'GeeksforGeeks',
    url: 'https://www.geeksforgeeks.org/user/user_snvvsuchandra369/',
    icon: 'graduation-cap',
    category: 'coding',
    color: '#2F8D46'
  },
  {
    id: 'hackerearth',
    name: 'HackerEarth',
    url: 'https://www.hackerearth.com/@snvvs369/',
    icon: 'globe',
    category: 'coding',
    color: '#323754'
  },
  {
    id: 'topcoder',
    name: 'TopCoder',
    url: 'https://profiles.topcoder.com/suchandra369',
    icon: 'trophy',
    category: 'coding',
    color: '#29A8E0'
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/users/22353817/suchandra',
    icon: 'layers',
    category: 'coding',
    color: '#F58025'
  },
  
  // Creative & Writing
  {
    id: 'medium',
    name: 'Medium',
    url: 'https://medium.com/@snvvs369',
    icon: 'book-open',
    category: 'creative',
    color: '#000000'
  },
  {
    id: 'devto',
    name: 'Dev.to',
    url: 'https://dev.to/suchandra',
    icon: 'hash',
    category: 'creative',
    color: '#0A0A0A'
  },
  {
    id: 'hashnode',
    name: 'Hashnode',
    url: 'https://hashnode.com/@suchandra',
    icon: 'hash',
    category: 'creative',
    color: '#2962FF'
  },
  {
    id: 'kaggle',
    name: 'Kaggle',
    url: 'https://www.kaggle.com/snvvsuachandraetti',
    icon: 'bar-chart-2',
    category: 'coding',
    color: '#20BEFF'
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    url: 'https://dribbble.com/suchandra369',
    icon: 'dribbble',
    category: 'creative',
    color: '#EA4C89'
  },
  {
    id: 'behance',
    name: 'Behance',
    url: 'https://www.behance.net/shivashiva187',
    icon: 'palette',
    category: 'creative',
    color: '#1769FF'
  },
  {
    id: 'codepen',
    name: 'CodePen',
    url: 'https://codepen.io/snvvsuchandraetti',
    icon: 'pen-tool',
    category: 'coding',
    color: '#000000'
  },
  {
    id: 'codesandbox',
    name: 'CodeSandbox',
    url: 'https://codesandbox.io/u/suchandra',
    icon: 'box',
    category: 'coding',
    color: '#151515'
  },
  {
    id: 'discord',
    name: 'Discord',
    url: 'https://discordapp.com/users/1024284026489544725',
    icon: 'message-circle',
    category: 'social',
    color: '#5865F2'
  },
  {
    id: 'linktree',
    name: 'Linktree',
    url: 'https://linktr.ee/snvvs369',
    icon: 'link',
    category: 'professional',
    color: '#43E55E'
  }
];

// Helper to get links by category
export const getSocialLinksByCategory = (category: SocialLink['category']): SocialLink[] => {
  return socialLinks.filter(link => link.category === category);
};

// Get coding platform links
export const getCodingPlatformLinks = (): SocialLink[] => {
  return socialLinks.filter(link => link.category === 'coding');
};

// Get main social links (for footer/navbar)
export const getMainSocialLinks = (): SocialLink[] => {
  const mainIds = ['github', 'linkedin', 'twitter', 'instagram', 'leetcode'];
  return socialLinks.filter(link => mainIds.includes(link.id));
};
