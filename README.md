DailyLog - 每日跟踪器 (React + Firebase)

这是一个基于 React 和 Firebase Firestore 构建的每日待办事项、购物清单和心情跟踪应用。它支持用户私有数据存储和多人共享同步功能。

🚀 部署到 Vercel

克隆仓库： 将此项目推送到您的 GitHub 仓库。

导入 Vercel： 登录 Vercel，选择 "Import Project"，并从您的 GitHub 导入此仓库。

Vercel 自动构建： Vercel 会自动检测到 package.json 和 Vite 构建工具，并运行 npm run build。

完成： 部署完成后，您将获得一个可用的 URL。

💡 如何使用

登录： 您可以使用邮箱/密码登录，或选择“游客免注册试用”。

日期导航： 使用左右箭头切换日期，查看历史记录或提前规划。

共享功能： 点击右上角的 “开启同步”，输入一个共享码（例如：family-project），即可与使用相同共享码的用户实时同步数据。

骨架屏优化： 应用集成了骨架屏，以改善在网络延迟较高时的数据加载体验。

🛠 技术栈

前端: React 18, Tailwind CSS

构建工具: Vite

数据存储: Firebase Firestore (实时同步)

身份验证: Firebase Authentication (匿名登录 / 邮箱密码)