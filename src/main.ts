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
      core.warning(`[AC] This Action is only support PR events.`);
      return;
    }

    const { owner, repo } = ctx.repo;
    const { title, number, labels } = ctx.payload.pull_request as {
      title: string;
      number: number;
      labels: object[];
    };

    const titleType = title.split(':')[0];
    if (titleType) {
      if (enumInput) {
        const enumArr = dealStringToArr(enumInput);
        if (enumArr.indexOf(titleType) === -1) {
          core.warning(`[AC] This PR type: ${titleType} is not in list to deal.`);
          return;
        }
      }

      const prLabels: string[] = labels.map(({ name }: any) => name);
      const needLabel = format.replace('${type}', titleType);

      if (extra) {
        const extraObj = {} as any;
        dealStringToArr(extra).forEach(ex => {
          const [key, val] = ex.split('/');
          extraObj[key] = val;
        });
        if (extraObj[titleType]) {
          needLabel.replace(titleType, extraObj[titleType]);
        }
      }

      if (prLabels.indexOf(needLabel) > -1) {
        core.info(`[AC] 🎁 This PR already has ${needLabel}.`);
      } else {
        await octokit.issues.addLabels({
          owner,
          repo,
          issue_number: number,
          labels: dealStringToArr(needLabel),
        });
        core.info(`[AC] 🎉 This PR add ${needLabel} success.`);
      }
    } else {
      core.setFailed(`[AC] This PR title is not has a type!`);
    }
    core.info(THANKS);
  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
