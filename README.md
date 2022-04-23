# Sログ: 学生の学び場マップ

## これはなに

See [HackMD]()

<!-- https://www.canva.com/design/DAE94Hw6_Co/GvL1urg9Dl63h92rpvtBUQ/edit?utm_content=DAE94Hw6_Co&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton
 -->

## 技術スタック

- Vue.js (フロントエンド SPA)
- leaflet.js (インタラクティブMap)
- Firebase Auth (ユーザ認証認可)
- Firestore (データ永続化)
- Github Pages (ホスティング)

## 開発環境の作り方

(Windows11を前提としています)

- Git for windows をインストールする
- Visual Studio Code をインストールする
- このリポジトリをクローンする:
  ```sh-session:
  PS C:¥> git config --global core.crlf input
  PS C:¥> git clone https://github.com/hinamei/Study-Map
  PS C:¥> cd Study-Map
  ```
- VS Code で開き、推奨プラグイン (Live Share, Five Server)を導入しておく。
  ```
  PS C:¥Study-Map> code .
  ```
- VS Code 上で Five Server を開始する:
  - `ctrl`+`Shift` + `P` -> `Five Server: Start` 
  - または 右下の 「Go Live」をクリック


## 開発のすすめかた (フォークしないパターン)

- 開発したいアイテムを Issue として登録する。
- 開発用ブランチを作る。Issueのページの右側にある「create a branch」
- ブランチで開発を進める。`git switch ブランチ名`
- 開発してプッシュする。`git commit` -> `git push origin`
- プルリクエストをつくる。GitHubのブランチのページで Contribute ⇒ Open Pull Request

