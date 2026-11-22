import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { publicDir } from './common/public-dir';

const workspacePaths = [
  'platform',
  'about',
  ...['users', 'announcements', 'job-postings'].flatMap((resource) => [
    resource,
    `${resource}/create`,
    `${resource}/:id(\\d+)`,
    `${resource}/:id(\\d+)/edit`,
  ]),
  'job-postings/:id(\\d+)/applications',
  'job-applications',
  'job-applications/:id(\\d+)',
];

@ApiTags('demo')
@Controller()
export class AppController {
  @Get()
  getRoot(@Res() response: Response): void {
    response.sendFile('index.html', { root: publicDir });
  }

  @Get(workspacePaths)
  @ApiExcludeEndpoint()
  getWorkspace(@Res() response: Response): void {
    response.sendFile('workspace.html', { root: publicDir });
  }

  @Get('404')
  @ApiExcludeEndpoint()
  getNotFound(@Res() response: Response): void {
    response.status(404).sendFile('error.html', { root: publicDir });
  }

  @Get('hello')
  getHello(): string {
    return 'hello world';
  }

  @Get('hello/:name')
  getHelloName(@Param('name') name: string): string {
    return `hello ${name}`;
  }

  @Get('sum/:number1/:number2')
  getSum(
    @Param('number1') number1: string,
    @Param('number2') number2: string,
  ): string {
    const result = Number(number1) + Number(number2);
    return String(result);
  }
}
