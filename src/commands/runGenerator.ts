import { window, Uri } from 'vscode';
import { getGenerators } from '../sao/parser';
import { SaoGenerator } from '../sao/types';

export default async function (uri: Uri) {
  const generators = getGenerators();

  const items = new Array<string>();

  for (const generator of generators) {
    items.push(generator.name);
  }

  const selectedItem = await window.showQuickPick(items, {
    placeHolder: 'Select the Generator to run',
  });

  if (selectedItem !== undefined) {
    const selectedGenerator = generators.find((elem) => elem.name === selectedItem);

    if (selectedGenerator !== undefined) {
      invokeGenerator(selectedGenerator, uri);
    }
  }
}

function invokeGenerator(generator: SaoGenerator, rootDir: Uri) {
  const args = generator.opts.split(' ');
  if (rootDir !== undefined) {
    args.push(rootDir.path);
  }

  const terminal = window.createTerminal(generator.name, 'sao', args);
  terminal.show();
}
