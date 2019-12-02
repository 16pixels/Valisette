module.exports = {
  title: 'Valisette',
  base: '/Valisette-documentation/',
  description: "A progressive boilerplate to code performant apps.",
  themeConfig: {
    lastUpdated: 'Last Updated',
    logo: './valisette-logo.png',
    sidebarDepth: 2,
    sidebar: [
      ['/guide/', 'Introduction'],
      ['/guide/REQUIREMENTS.md', 'Requirements'],
      ['/guide/START.md', 'Getting Started'],
      ['/guide/CONFIGURATION.md', 'Configuration File'],
      ['/guide/COMMANDS.md', 'Boilerplate commands'],
      ['/guide/ASSETS.md', 'Handling Assets'],
    ],
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: '16 Pixels', link: 'https://16pixels.fr' },
    ]
  }
}
