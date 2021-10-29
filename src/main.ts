import * as core from '@actions/core';
import * as github from '@actions/github';
import { Octokit } from '@octokit/rest';
import { dealStringToArr, THANKS } from 'actions-util';

async function run(): Promise<void> {
  try {
    const token = core.getInput('token');
    const octokit = new Octokit({ auth: `token ${token}` });

    const enumInput = core.getInput('enum');
    const format = core.getInput('format') || 'pr(${type})';
    const extra = core.getInput('extra');

    const ctx = github.context;
    if (ctx.eventName.indexOf('pull_request') === -1) {
      core.warning(`[AC] 🛑 This Action is only support PR events.`);
      return;
    }

    const { owner, repo } = ctx.repo;
    const { title, number, labels } = ctx.payload.pull_request as {
      title: string;
      number: number;
      labels: object[];
    };

    core.info(`[AC] 🛎 This PR number is [${number}].`);

    let titleType = title.split(':')[0];
    if (titleType.split('(').length > 0) {
      titleType = titleType.split('(')[0];
    }

    let ifAddNew = true;

    if (titleType) {
      if (enumInput) {
        const enumArr = dealStringToArr(enumInput);
        if (enumArr.indexOf(titleType) === -1) {
          core.warning(`[AC] 🛡 This PR type: ${titleType} is not in list to deal.`);
          ifAddNew = false;
        }
      }

      const prLabels: string[] = labels.map(({ name }: any) => name);
      let needLabel = format.replace('${type}', titleType);

      if (extra) {
        const extraObj = {} as any;
        dealStringToArr(extra).forEach(ex => {
          const [key, val] = ex.split('/');
          extraObj[key] = val;
        });
        if (extraObj[titleType]) {
          needLabel = needLabel.replace(titleType, extraObj[titleType]);
        }
      }

      if (prLabels.indexOf(needLabel) > -1) {
        core.info(`[AC] 🎁 This PR already has ${needLabel}.`);
      } else {
        const [b, e] = format.split('${type}');
        const removeLabels = prLabels.filter(name => name.startsWith(b) && name.endsWith(e));

        if (removeLabels.length) {
          for (const label of removeLabels) {
            await octokit.issues.removeLabel({
              owner,
              repo,
              issue_number: number,
              name: label,
            });
            core.info(`[AC] 🔔 This PR remove ${label} success.`);
          }
        }

        if (ifAddNew) {
          await octokit.issues.addLabels({
            owner,
            repo,
            issue_number: number,
            labels: dealStringToArr(needLabel),
          });
          core.info(`[AC] 🎉 This PR add ${needLabel} success.`);
        }
      }
    } else {
      core.setFailed(`[AC] 🛑 This PR title is not has a type!`);
    }
    core.info(THANKS);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
