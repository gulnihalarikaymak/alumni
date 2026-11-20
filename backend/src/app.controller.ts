import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { landingDir } from './common/views';

@ApiTags('demo')
@Controller()
export class AppController {
  @Get()
  getRoot(@Res() response: Response): void {
    response.sendFile('index.html', { root: landingDir });
  }

  // The workspace remains available alongside the public landing page.
  @Get('platform')
  @Render('home')
  getPlatform() {
    return { title: 'ATS Platform' };
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

  @Get('about')
  @Render('about')
  getAbout() {
    return { title: 'About' };
  }
}
