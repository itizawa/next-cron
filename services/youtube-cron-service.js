
class YoutubeBatchService {

  async hoge() {
    console.info(`現在の時間は ${new Date()}`);
  }

}

const service = new YoutubeBatchService();
module.exports = service;
