# Git Introduction

![Estimated completion time](https://img.shields.io/badge/Estimated%20Time-2%20hours-7FFF7F)
&nbsp;
![Overall Difficulty](https://img.shields.io/badge/Overall%20Difficulty-⭐-3498DB)
&nbsp;
![Files Assessed](https://img.shields.io/badge/Files%20Assessed-yes-darkgreen)
&nbsp;
![Eslint Assessed](https://img.shields.io/badge/Style%20Assessed-no-FFC0CB)
&nbsp;
![Test Quality Assessed](https://img.shields.io/badge/Test%20Quality%20Assessed-no-FEDC56)
&nbsp;

**Note**: Week 1 labs are worth 0% of your final grade. However, we will still automark this lab for you and provide you with a score out of 1 to give you a feel of the process. Please see our guide on Webcms3 for further details.

[TOC]

## Due Date

Week 2 Monday 5:00 pm [Sydney Local Time](https://www.timeanddate.com/worldclock/australia/sydney)

## GitLab

This is your repository (repo) on GitLab for this lab exercise.

If you are familiar with GitHub then you will find GitLab familiar. You are currently reading text from [README.md](README.md), a file stored in this repository.

Feel free to browse through GitLab and familiarise yourself with it.

If this is your first time using Git and GitLab, the guide below will help you get started.

## Adding Your ED25519 SSH Key to GitLab

The instructions below are geared toward working in a Linux environment (similar to CSE machines, which can be accessed through VLAB).

If you are on Windows, it is recommended that you install Windows Subsystem for Linux (WSL). See the Getting Started guide on Webcms3 for further information.

### Step 1 - Checking For Existing Key

To check if you have an ed25519 ssh key, use the `cat` command (**do not copy the shell prompt, aka dollar symbol: `$`**):
```shell
$ cat ~/.ssh/id_ed25519.pub
```

While you are **unlikely to see this**, if a key does indeed exist, the output will be similar to:

```shell
$ cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGaEIgJc0mYJrqCotx44BITlQFA8cdRIiEh4HgEjf2aQ z5555555@weaver
```

Skip to [Step 3 - Adding Your SSH Key to GitLab](#step-3---adding-your-ssh-key-to-gitlab) if the key exists, otherwise, proceed with [Step 2 - Generating a New Key](#step-2---generating-a-new-key).

### Step 2 - Generating a New Key

To generate a new ed25519 ssh key, use the command:
```shell
$ ssh-keygen -t ed25519
```

For each prompted question, you can leave them blank and simply hit enter. For example:

```shell
$ ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file їn which to save the key (/import/ravel/5/z5555555/.ssh/id_ed25519):
Created directory ′/import/ravel/5/z5555555/.ssh′.
Enter passphrase (empty foṟ no passphrase):
Enter same passphrase again:
Your identification has been saved їn /import/ravel/5/z5555555/.ssh/id_ed25519.
Your public key has been saved їn /import/ravel/5/z5555555/.ssh/id_ed25519.pub.
The key fingerprint is:
cf:16:45:51:3f:7a:db:a0:71:7d:1c:d9:1a:95:1e:01 z5555555@weaver
The key′s randomart image is:
+--[ED25519 256]--+
| H A . D .E . G. |
| R   Y..  . N  I |
| . A .. .  +.+ U |
|+ . .  . +.o. L .|
|.X + .. S o B  I |
|O = + N  .. .A N.|
| B o    I .   A  |
|* ...o . o .T  . |
|.o.o+..  o   A M |
+----[SHA256]-----+
```

### Step 3 - Adding Your SSH Key to GitLab

1. Copy your public ssh key, which can be retrieved using the command:
    ```shell
    $ cat ~/.ssh/id_ed25519.pub
    ```
    Here is an **example of what you should copy** from the output:
    ```text
    ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIGaEIgJc0mYJRqcoNx44BITlQFA8cdRIiEh4HgEjf2aQ z5555555@weaver
    ```

1. Go to: https://nw-syd-gitlab.cseunsw.tech/-/profile/keys. Log in again if you are asked to do so.

1. Paste the key into the large text area for **Key**. The **Title** field underneath should be filled automatically.

1. Click the **Add Key** button.

## Using Git

This exercise is intended to help you familiarise yourself with git.

If you have not used git before, it can take a while to get used to it and learn how it works.

Make sure you understand exactly what you're doing in the following exercise. **DO NOT BLINDLY ENTER IN THE COMMANDS WITHOUT KNOWING WHAT THEY DO.**

### Background

Git is a distributed version control system. It allows you to record changes to a set of files over time and synchronise those changes across many *repositories*. 

What you are looking at now is one of these repositories, stored on a remote GitlLb server at UNSW. You do not have direct access to that computer, so to make changes to files contained within it, you need to copy (or `pull`) them to a *local* repository. You can then make changes to this local repository and `push` those changes to the remote GitLab server. 

For this to happen, however, git needs to be installed and configured.

### Setting Up

#### Part 1 - Checking If Git is Installed

Use the command below to check if git is installed on your machine:

```shell
$ git --version
```
If it is installed you will see something similar to:
```text
git version 2.30.2
```
If you do not have git installed, you will see something like:
```text
bash: git: command not recognized
```

Install git with [Part 2 - Installing Git](#part-2---installing-git) if necessary, else skip to [Part 3 - Git Configuration](#part-3---git-configuration).

#### Part 2 - Installing Git    

The installation process will vary depending on your operating system. Note that **if you are on Windows using WSL, you should follow the Linux instructions**.

- **Linux** - Follow instructions at https://git-scm.com/download/linux
- **Mac** - Either download from https://git-scm.com/download/mac or install using [Homebrew](https://brew.sh/) or equivalent.
- **Windows** - Download from https://gitforwindows.org/

There are other ways of getting git for all of these platforms. You are free to use whichever way works best for you - however, our instructions below will assume that you are working in a Linux environment.

#### Part 3 - Git Configuration

Configure git if you have not used it before, using the four commands below (NOTE: replace with your real name and UNSW Email address):
```shell
$ git config --global user.name "Put Your Name Here"
$ git config --global user.email "z5555555@ad.unsw.edu.au"
$ git config --global push.default simple
$ git config --global pull.rebase false
```

### Cloning

A repository (or repo for short) is a directory that is linked with git).

When you `clone` a repository, git will copy all files in the repo, as well as a complete history of the changes, or commits, created for those files to your local machine. Cloning a repo is a necessary step before you can make changes.

For each lab task in this course, a repo will be created for you on GitLab. You will use it to store your work as you complete it.

To clone this lab's repo, you first need to get its SSH URL. To do this, click on the blue **Clone** button at the top-right of this page. Copy the URL under **Clone with SSH** (you can click the copy icon on the right of the link)

To make the actual clone, navigate to the directory (folder) where you want to store COMP1531-related exercises and run the following commands:

```shell
$ git clone SSH_URL_YOU_COPIED_FROM_GITLAB
$ cd lab01_git            # To navigate into the directory
```

If you have completed [Adding Your ED25519 SSH Key to GitLab](#adding-your-ed25519-ssh-key-to-gitlab) correctly, you should **not** be prompted to enter a password.

### Making a commit

After cloning the repo, you are ready to work on the codebase locally.

A commit represents a set of changes to the files in a repository and a message describing those changes for human readers. Good use of git involves many commits with detailed messages.

Before you can `commit`, you have to *stage* your changes, effectively telling git which changes you want to commit and which changes you don't.

Making commits do not replicate your changes to the remote repository on GitLab. For this you need to `push` your commits, uploading them to the remote server. When collaborating with others, it is important not only to commit frequently but also to push often.

In general, the commands to commit and push are as follows:
```shell
$ git add FILE_TO_COMMIT1 FILE_TO_COMMIT2 etc             # Stage
$ git commit -m "Detailed message describing the changes" # Commit
$ git push                                                # Push to GitLab
```

Another very useful command to see the current state of git is:
```shell
$ git status
```

Follow these steps to see them in action:

1. Create a file called `first.txt` with a single line containing a message of your choice and save it in the repo directory. One quick way to do this is:
    ```shell
    $ echo "I am first" > first.txt
    ```
    Confirm that you can see this file with the command:
    ```shell
    $ ls
    ```

1. Go back to your terminal and enter the following commands:
    ```shell
    $ git status
    $ git add first.txt
    $ git status
    $ git commit -m "Added a line to first.txt"
    $ git status
    $ git push
    $ git status
    ```

1. **MAKE SURE YOU UNDERSTAND THE PURPOSE OF EACH OF THE COMMANDS ABOVE!** If you are unsure about any of them, ask your tutor or lab assistant.
1. Go back to GitLab and confirm that your changes have been pushed to the server (you may need to refresh the page).

## Working with others

Usually, when you are using git, it is in a team. This means that you will not be the only one making changes. If someone else makes a change and pushes it to the server, your local repo will not have the most up-to-date version of the files. Fortunately, git makes it easy to update your local copy with the `git pull` command.

This command checks the remote server that your local repo is linked to and ensures that all files are up to date. This prevents you from accidentally doing things like implementing the same feature someone else has already done and also lets you use other people's work (e.g. new functions) when developing.

Pulling regularly is one of the **most important** practices in git!

Unfortunately, at the moment you are just working individually. But GitLab still gives us a nice way to practice a `git pull`.

**Instructions:**

1. View your repo on GitLab (i.e. this webpage, at the very top). Make sure to **refresh** the page.
2. Click on the `first.txt` file and confirm that the line you have "pushed" from your terminal is present.
3. Click the 'Edit' button on the right-hand side (it might say "Open in Web IDE, in which case click on the dropdown arrow to see 'Edit').
4. Make a small change to the line of text and click the ‘Commit Changes’ button at the bottom of the screen.
5. This will update `first.txt` on GitLab but not your local environment. In the terminal, retrieve these changes with the command:
    ```shell
    $ git pull
    ```
6. Confirm that your local `first.txt` now has the changes you made on the GitLab website.

## Testing Basics

To check that you have completed this exercise correctly, use the command:

```shell
$ bash test_git_basics.sh
```

---

Now is a good time to **take a long break from Git** :).

You should be able to complete the remaining labs in week 1 with the knowledge above.

---

# Branching and Merging

This next section is considered a more advanced part of git. You are recommended to complete this after practising the submission of `lab01_leap` and `lab01_academics`.

## Branching

**Branches** are a vital part of git and allow people to work on separate parts of the codebase without interfering with one another. This minimises the risk of breaking a product that is visible to the client, since breaking one branch will not have an impact on any other.

Good use of git will involve separating distinct features of the project such that they can be worked on separately and having them in their branch. These branches can then be merged when they are ready.

Useful commands for branches:

```shell
$ git checkout -b NEW_BRANCH_NAME # Create a new branch and switch to it
$ git branch                      # List all current branches
$ git checkout BRANCH_NAME        # Switch to an existing branch
```

Follow these instructions to create a branch:

1. Create and checkout a new branch called `new_branch`:
    ```shell
    $ git checkout -b new_branch
    ```

1. List your branches to confirm this:
    ```shell
    $ git branch
    ```
    You should see an asterisk (`*`) next to `new_branch`, indicating that you are currently on this branch.

1. Create a new file called `second.txt`. A quick way to do this would be:
    ```shell
    $ echo "I am second" > second.txt
    ```

1. Use git to `add`, `commit` and `push` your changes. Refer back to [Making a commit](#making-a-commit) if necessary.

1. The above step may give you the following error:
    ```
    fatal: The current branch new_branch has no upstream branch.
    To push the current branch and set the remote as upstream, use

        git push --set-upstream origin new_branch
    ```
    This means that the branch you tried to push to does not exist on GitLab - you've only created it locally!

1. To fix this, you can copy the command containing `--set-upstream` that git told us about in the output above, or the shorter form:
    ```shell
    $ git push -u origin new_branch
    ```

    **Note:** This step above **only needs to be done the first time you try pushing a new branch to GitLab** After you have done this once, you can use
    ```shell
    $ git push
    ```
    to continue pushing to the branch you are currently on.
    
1. Refresh the GitLab page and confirm that your branch has been created. You can do this by clicking on the dropdown menu near the top-left (it should currently say "master").

## Merging

Merging branches is used to combine the work done on two different branches and is where git truly shines. Git will compare the changes done on both branches and decide (based on what changes were done to what sections of the file and when) what to keep. Merges are most often done when a feature branch is complete and ready to be integrated with the master branch.

Since we have finished our work on `new_branch`, we can merge it back into the master branch.

**NOTE**: It is strongly recommended, both in this course and in general, to always ensure the code on the `master` branch works correctly and is free of bugs. This is not always easy to achieve, but you should endeavour to keep the master branch as *stable* as possible.

Another recommendation is to **merge *master* into your branch *before* merging *your branch* back into master** as this will ensure that any merge into the master will be without conflict.

In general, merges are done by:

```shell
$ git merge [target] # Merge the target branch into the current branch
```

**Note:** A successful merge automatically uses the commits from the source branch. This means that the commits have already been made, you just need to push these to the server (`git push`)

To merge your changes from above:
1. Confirm that we are still on `new_branch`:
    ```shell
    $ git branch # We can also use git status
    ```

1. Switch back to the `master` branch
    ```shell
    $ git checkout master
    ```

1. Merge `new_branch` into our current `master` branch. This should contain the changes to `second.txt`.
    ```shell
    $ git merge new_branch
    ```

1. Push the successful merge to GitLab

1. Refresh the GitLab page and confirm that `new_branch` has been merged to master.

### Merge conflicts

Merge conflicts occur when git cannot determine which change you want when merging two branches that have each modified the same file.

While they can sometimes be avoided with good use of git like small and regular pushing, pulling, and merging, you will likely face them quite often throughout the term.

For this part, we will engineer a merge conflict to get a taste of what they are, how they occur and how we can fix them. The process may seem involved but it is quite common when multiple people are working on a project simultaneously.

1. On your local master branch, create a new file called `third.txt`:
    ```shell
    $ git checkout master
    $ echo "I am third" > third.txt
    ```

1. `Add`, `commit` and `push` your changes in `third.txt` to GitLab's `master` branch

1. Switch to (`checkout`) your local `new_branch`.

1. Create `third.txt` again, but with a different message. For example,
    ```shell
    $ echo "3rd time's the charm" > third.txt
    ```

1. `Add`, `commit` and `push` your changes in `third.txt` to GitLab's `new_branch`.

1. Merge `master` into your current branch, `new_branch`:
    ```shell
    $ git merge master
    ```

1. This sequence of steps should create a merge conflict at the top of the `third.txt` with the following output:
    ```text
    Auto-merging third.txt
    CONFLICT (add/add): Merge conflict in third.txt
    Automatic merge failed; fix conflicts and then commit the result.
    ```

#### Resolving a merge conflict

Resolving a merge conflict is as simple as editing the file normally, choosing what you want to have in the places git wasn't sure.

A merge conflict is physically shown in the file in which it occurs, with the following conflict markers:
- `<<<<<<<` marks the beginning of the conflicting changes made on the **current** (merged into) branch.
- `=======` marks the beginning of the conflicting changes made on the **source** (merged from) branch.
- `>>>>>>>` marks the end of the conflict zone.

For example:

```text
<<<<<<< HEAD
3rd time's the charm
=======
I am third
>>>>>>> master
```

The above example could be solved in many ways. One way would be to use the changes made on the source branch (i.e. `master`) and delete those made on our current branch (i.e. `new_branch`).

Another way would be to combine the change, which can be done by removing the git conflict markers. For example, the result can look something like this:
```
3rd time's the charm
I am third
```

We would then just add and commit the resolved file and the merge conflict is finished!

To fix the conflict you created:
1. Open `third.txt` in a text editor

1. Decide which change you want to keep and remove the merge conflict markers once you are happy with the change.

1. Use git to `add` and `commit` the resolved merge conflict (don't `push` just yet).

### Creating a Merge Request on GitLab

In your major group project, you will not be able to modify GitLab's master branch by pushing directly to it. Instead, you will need to create a merge request using GitLab's interface.

1. Push your local `new_branch` to GitLab's `new_branch`. Note (from the final step of [Branching](#branching))
that we can use the command below because `new_branch` already exists on GitLab:
    ```shell
    $ git push
    ```

1. As we are not pushing to the main (master) branch, git will prompt us with a message containing:
    ```
    ...
    remote: To create a merge request for new_branch, visit:
    remote:   https://gitlab.cse.unsw.EDU.AU/COMP1531/some/url/in/your/terminal/that/you/can/click/on/
    ...
    ```

1. Visit the link in your terminal and it will take you to a **New merge request** page.

1. Enter a description, then click on the "Create merge request" button at the bottom of the page. This will take you to another page with the merge request.

1. **For this lab only**, untick (remove the tick) from the box in "Merge options" that says "*Delete source branch when merge request is accepted*".

1. Click Merge, then go back to your repository's main page on GitLab. Refresh the page if necessary.

1. Back in your terminal, `checkout` the master branch one final time:
    ```shell
    $ git checkout master
    ```
    
1. Pull the new changes from GitLab to your local machine, and confirm that they are consistent:
    ```shell
    $ git pull
    ```

## Testing Branch and Merge

To check that you have done the branching and merging exercise correctly, use the command
```shell
$ bash test_git_advance.sh
```

--- 

Now is a good time to **take another break from Git** :).

This is a lot of information to process so don't expect to understand everything the first time. You can revisit and redo this lab (in part or in full) as many times as you want!

--- 

# Summary

A reminder that the `git status` command will always come in handy :).

Also, whenever you change your local environment (i.e. your laptop instead of your other home computer), you will need to generate
a new ED25519 SSH key and repeat the setup.

## Labs

You are allowed to push directly to the master branch when completing lab exercises. The workflow is usually:

1. `git clone INSERT_LAB_SSH_URL`
1. `cd lab0X_example`
1. Make changes to the relevant files
1. `git add FILE1 FILE2 ...`
1. `git commit -m "A relevant message for the change"`
1. `git push`

## Major Project

After cloning the project, below are two scenarios you will likely face.

### Creating a new feature branch

For example, creating a branch called `FEATURE_BRANCH`:

1. `git checkout master` (we usually want to branch out from the master branch) 
1. `git pull` (get the latest changes from your team members before branching out)
1. `git checkout -b FEATURE_BRANCH` (branch out from master)
1. Make changes to the relevant files and save them.
1. `git add FILE1 FILE2 ...`
1. `git commit -m "A relevant message for the change"`
1. `git push -u origin FEATURE_BRANCH` (only needed the first time to create the same branch on GitLab, then regular `git push` after)
1. Refresh GitLab and confirm that your local `FEATURE_BRANCH` branch is present and matches GitLab's `FEATURE_BRANCH`.

### Merging into master

1. Add and commit your final changes to `FEATURE_BRANCH`.
1. Before merging your `FEATURE_BRANCH` into GitLab's `master`,
    - it is recommended that you first merge GitLab's `master` into your local `FEATURE_BRANCH`.
    - this way, conflicts can be resolved locally.
    - while you can do this by checking out master, pull, then checkout back to your branch and merge, another way is to pull GiLlab's `master` branch directly into your local `FEATURE_BRANCH`:
        ```shell
        $ git pull origin master # assuming you are currently on FEATURE_BRANCH
        ```
1. Locally resolve any merge conflicts that occurred, then `add`, `commit` and `push` to GiLlab's `FEATURE_BRANCH`.
1. Follow the link outputted from the `push` command to create a merge request.
1. Assign yourself as the Assignee and wait for a Reviewer (team member) to approve the merge request.
1. You can merge `FEATURE_BRANCH` into `master` once the merge request has been approved.
(it is up to your group to decide the number of approvals from team members necessary before a merge).

# Miscellaneous

<details close>
<summary>Other useful commands/tips that are <b>not</b> core to the course</summary>

<br/>

**NOTE: you do not need to know any of the commands below for this course:**

1. `git log` 
    - this command shows you the history of commits locally.
    - You can pretty-print the result in one line per commit with:
        ```shell
        $ git log --color --graph --pretty=tformat:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)%an %Creset' --abbrev-commit
        ```
        However, you can also change the default display behaviour in your `~/.gitconfig` file (located in the home directory of your machine) by adding:
        ```
        [format]
            pretty = tformat:%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)%an %Creset
        ```
        and simply use
        ```shell
        $ git log
        ```

1. `git stash` 
    - when you have uncommitted changes (e.g. files in red from `git status`) and you're trying to pull or merge, git will say that it isn't possible to do so because your changes will be overwritten.
    - What you can do is `git stash` the changes temporarily (which hides them in another location), pull/merge, then `git stash pop` to retrieve these files (potentially resolving conflicts)
    - it is also useful if you've been working on the wrong branch and would like to move the unsaved changes there. `git stash`, `git checkout correct_branch`, `git stash pop`.

1. `git reset`
    - There are many uses for this command. We will only cover one of them here.
    - Supposed you have added files to the index (staging area), i.e. shown in
      green from `git status`, and wish to remove them from the index (i.e.
      back to red). This can be done with:
        ```shell
        $ git reset FILE_TO_REMOVE_FROM_INDEX
        ```

1. `git switch`
    - Sometimes `git checkout` is confused about whether you are using `checkout` on a branch, or a file with the same name.
    - This is a more explicit way of switching branches and is often recommended.

1. `git diff`
    - To view the differences between your unsaved changes to your current branch
    - `git diff --cached` is similar but applies to the index (staging area)
    - Can also compare two branches, e.g. Supposed we are on `new_branch` and want to see how our `third.txt` differs from the `master` branch:
        ```shell
        $ git diff master third.txt
        ```

For further details about any git commands, you can always read the manual page. For example:
```shell
$ man git status
```

</details>
