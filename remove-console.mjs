import { replaceInFile } from 'replace-in-file';

const options = {
  files: [
    'frontend/medtrax/src/**/*.js',
      'backend/**/*.js',
    '*.js'
    ],
  from: [
    /console\.log\(.*?\);?/gs,
    /console\.log\(.*?\n.*?\);?/gs,
  ],
  to: '',
  countMatches: true,
};

replaceInFile(options)
  .then(results => {
    console.log('All console.log statements removed!');
    results.forEach(result => {
      if (result.hasChanged) {
        console.log(`Updated: ${result.file} (${result.numMatches} removed)`);
      }
    });
  })
  .catch(error => {
    console.error('Error occurred:', error);
  });