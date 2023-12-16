# holidaygift
I like to do cute surprises for friends around the holidays. For 2023, I decided to make a customized holiday gift website, which can provide customized message for predefined recipients as well as distribute preconfigured Steam game redeemable codes. Realistically, this also ended up as a fun testbed example single-page Next.js webapp.

## Local development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variable Setup

This project is designed to use a JSON value stringified into `MYSTERY` environment variable.

For reference, this is the generally-expected interface of the object:

```ts
interface MysteryObject {
  [userID: string]: {
    name?: string; // recipient name
    message?: string; // customized gift message to override default top message
    games: {
      name: string; // game name, not currently used anywhere
      code: string; // redeemable game code value
    }[]; // array of the game details
  }
}
```

For example:

```json
{
  "00000000-0000-0000-0000-000000000000":{
    "name":"Mr. Debug",
    "message":"Test debug message.",
    "games":[
      {"name":"Game 1","code":"00000-00000-00000"},
      {"name":"Game 2","code":"00000-00000-00000"},
      {"name":"Game 3","code":"00000-00000-00000"}
    ]
  },
  "11111111-1111-1111-1111-111111111111":{
    "games":[
      {"name":"Game 1","code":"00000-00000-00000"},
      {"name":"Game 2","code":"00000-00000-00000"},
      {"name":"Game 3","code":"00000-00000-00000"}
    ]
  }
}
```
Then stringify the JSON and store as a `MYSTERY` environment variable.

User gifts can then be accessed via unique special `https://webserver/?id=<userID>` URLs, while anyone visiting the webserver without the proper ID will just get a basic holiday greeting (no gift).

# License

Based on code  originally by Codrops https://tympanus.net/codrops/2013/12/24/merry-christmas-with-a-bursting-gift-box/
Copyright 2013, Codrops http://www.codrops.com
Licensed under the MIT license.
http://www.opensource.org/licenses/mit-license.php

Nextjs Typescript ES6 port by Jason Robitaille with alterations to suit game gifting purpose
Copyright 2023, Jason Robitaille
Updates licensed under the Apache-2.0 license.
https://www.apache.org/licenses/LICENSE-2.0.txt

Music "Festive Fireside" by Steve Oxen https://www.fesliyanstudios.com/royalty-free-music/download/festive-fireside/3153
Sound effects by https://pixabay.com
