# 手动推送和创建 PR 指南

## 当前状态
✅ 所有更改已提交到本地 main 分支（commit fd936c4）
⚠️ 需要推送到远程仓库并创建 PR

## 步骤 1: 配置 GitHub 认证

### 方法 A: 使用 SSH（推荐）

1. 生成 SSH key（如果还没有）:
```bash
ssh-keygen -t ed25519 -C "xepinchan@qq.com"
```

2. 添加 SSH key 到 GitHub:
   - 复制公钥内容: `cat ~/.ssh/id_ed25519.pub`
   - 访问 https://github.com/settings/keys
   - 点击 "New SSH key"，粘贴公钥

3. 修改 Git 远程仓库 URL 为 SSH:
```bash
cd E:\Github\Zen-Draw
git remote set-url origin git@github.com:sutchan/Zen-Draw.git
```

### 方法 B: 使用 Personal Access Token (HTTPS)

1. 生成 GitHub Personal Access Token:
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择权限: `repo` (完整仓库访问)
   - 生成 token 并复制

2. 配置 Git 使用 token:
```bash
cd E:\Github\Zen-Draw
git config --global credential.helper store
git push origin main
# 当提示输入用户名时，输入你的 GitHub 用户名
# 当提示输入密码时，粘贴你的 Personal Access Token
```

## 步骤 2: 推送到远程仓库

```bash
cd E:\Github\Zen-Draw
git push origin main
```

## 步骤 3: 创建 Pull Request

### 方法 A: 使用 GitHub 网页界面

1. 访问 https://github.com/sutchan/Zen-Draw
2. 点击 "Compare & pull request" 按钮（如果有）
3. 或者，点击 "Pull requests" 标签，然后点击 "New pull request"
4. 填写 PR 标题和描述:
   - 标题: `ci: v3.2.0 - 建立代码审查标准和流程`
   - 描述: 使用以下内容（从 commit message）

5. 点击 "Create pull request"

### 方法 B: 使用 GitHub CLI（如果已安装）

```bash
# 安装 GitHub CLI
# 访问 https://cli.github.com/ 下载安装

# 登录 GitHub
gh auth login

# 创建 PR
gh pr create --title "ci: v3.2.0 - 建立代码审查标准和流程" --body "见 commit message"
```

## 步骤 4: 解决冲突（如果有）并合并

1. 如果 PR 有冲突:
   - 在 GitHub 网页界面点击 "Resolve conflicts"
   - 手动解决冲突
   - 点击 "Mark as resolved"
   - 点击 "Commit merge"

2. 合并 PR:
   - 点击 "Merge pull request"
   - 选择合并方式:
     - "Merge commit" — 保留所有提交历史（推荐）
     - "Squash and merge" — 合并为一个提交
     - "Rebase and merge" — 变基合并
   - 点击 "Confirm merge"

3. 删除分支（可选）:
   - 点击 "Delete branch"

## 替代方案: 直接推送并创建 Release

如果你想直接发布 v3.2.0，而不创建 PR:

```bash
# 推送标签
cd E:\Github\Zen-Draw
git tag -a v3.2.0 -m "Release v3.2.0"
git push origin v3.2.0
```

然后在 GitHub 创建 Release:
1. 访问 https://github.com/sutchan/Zen-Draw/releases
2. 点击 "Create a new release"
3. 选择 tag: `v3.2.0`
4. 填写 release 标题和描述
5. 点击 "Publish release"

## 遇到问题？

如果遇到问题，请检查:
1. Git 用户配置: `git config --list | grep user`
2. 远程仓库配置: `git remote -v`
3. SSH 连接: `ssh -T git@github.com`
4. 或者，联系我获取帮助
