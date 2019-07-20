const articleCloneService = require('./assets/service/articleCloneService')

articleCloneService.autoPullRepository(process.argv[2] != undefined && process.argv[2] != null ? JSON.parse(process.argv[2]) : false)