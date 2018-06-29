// pm2 ecosystem configuration

module.exports = {
    apps: [{
        name: 'rest',
        watch: ['./'],
        ignore_watch: [
        ],
        script: 'main.js',
	env: 'development'
    }]
};

