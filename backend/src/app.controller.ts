import { Controller, Get, Param, Header } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('demo')
@Controller()
export class AppController {
  @Get()
  @Header('Content-Type', 'text/html')
  getRoot(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ATS Test Domain</title>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f9; }
          .container { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          h1 { color: #2c3e50; }
          p { color: #7f8c8d; }
          .links a { margin: 0 10px; color: #3498db; text-decoration: none; }
          .links a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to ATS Test Domain</h1>
          <p>This is a temporary main page.</p>
          <div class="links">
            <a href="/api/health">API Health Check</a>
            <a href="/users">Users</a>
            <a href="/hello">Hello API</a>
            <a href="/about">About</a>
          </div>
        </div>
      </body>
      </html>
    `;
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
  @Header('Content-Type', 'text/html')
  getAbout(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ATS - About</title>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background-color: #f4f4f9; }
          .container { text-align: center; padding: 2rem; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 500px; }
          h1 { color: #2c3e50; }
          p { color: #7f8c8d; line-height: 1.6; }
          .links { margin-top: 20px; }
          .links a { margin: 0 10px; color: #3498db; text-decoration: none; }
          .links a:hover { text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>About Alumni Tracking System</h1>
          <p>This system helps universities stay in touch with their graduates: who they are, where they work, and how they can help current students.</p>
          <div class="links">
            <a href="/">Back to Home</a>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}
