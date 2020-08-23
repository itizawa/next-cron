# next-cron


## Description

Fulfill a cron job using Express Custom Server with Next.js.

## Features

- timeSignalService
  - Send slack notification once **an hour**.
- youtubeService
  - Add new videos of channels registered in a specific playlist **at morning**.
- githubGrassService
  - **At the end of the day** you will be notified of the number of contributions for today.
  - Notifies me of the report once **a week**.
- qiitaTrendService
  - Notify qiita articles on a particular topic once every **20 minutes**.

## Installation

1. Clone and install
```
$ git clone https://github.com/itizawa/next-cron.git
$ cd next0cron
$ yarn
```

2. Prepare environment variables 
see below for setting values.

3. Starting
```
$ yarn dev
```

## Environment variables

### Basic Setting

| Variable                | Description                                  | Default  | Required           |
| ----------------------- | -------------------------------------------- | -------- | ------------------ |
| WEBHOOK_URL             | required for slack notification              |          | :white_check_mark: |

### Time signal service
| Variable                | Description                                  | Default  | Required           |
| ----------------------- | -------------------------------------------- | -------- | ------------------ |
| ENABLE_TIME_SIGNAL      | whether to enable time signal service        | false    |                    |
| CHANNEL_FOR_TIME_SIGNAL | notification channel for time signal service | #general |                    |



### Youtube Service

| Variable              | Description                              | Default  | Required           |
| --------------------- | ---------------------------------------- | -------- | ------------------ |
| ENABLE_YOUTUBE        | whether to enable youtube service        | false    |                    |
| YOUTUBE_PLAYLIST_ID   | target playlist to add                   |          | :white_check_mark: |
| CHANNEL_FOR_YOUTUBE   | notification channel for youtube service | #general |                    |
| YOUTUBE_API_KEY       | apikey                                   |          | :white_check_mark: |
| YOUTUBE_CLIENT_ID     | client id                                |          | :white_check_mark: |
| YOUTUBE_CLIENT_SECRET | client secret                            |          | :white_check_mark: |
| YOUTUBE_REFRESH_TOKEN | refresh token                            |          | :white_check_mark: |

Get each setting value by accessing here　https://console.cloud.google.com/

### GutHub Grass Service

| Variable                 | Description                              | Default  | Required |
| ------------------------ | ---------------------------------------- | -------- | -------- |
| ENABLE_GITHUB_GRASS      | whether to enable github grass service   | false    |          |
| CHANNEL_FOR_GITHUB_GRASS | notification channel for youtube service | #general |          |
| GITHUB_USERNAME                         | target users to get data                                         |          |  :white_check_mark:        |

### Qiita Trend Service

| Variable                    | Description                                  | Default  | Required           |
| --------------------------- | -------------------------------------------- | -------- | ------------------ |
| ENABLE_QIITA_TREND          | whether to enable qiita trend service        | false    |                    |
| CHANNEL_FOR_QIITA_TREND     | notification channel for qiita trend service | #general |                    |
| SEARCH_WORD_FOR_QIITA_TREND | target word to search data                   |          | :white_check_mark: |

## Anything Else

We are looking for PR of additional functions.

## Author

[@itizawa](https://twitter.com/itizawa_pen)

## License

[MIT](http://TomoakiTANAKA.mit-license.org)</blockquote>
