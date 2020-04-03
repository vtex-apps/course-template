# Course Template

This is a VTEX IO Course Template App. Here, you'll find a couple of **boilerplates** to define a course using the `course@0.x` builder. 

Right know, it outpus a **Github Learning Lab course**, alongside with a **correction service**, if you decide to use it.

## Prerequisites
You should be familiar **Github Learning Lab courses** in order to better understand this template. Learn about it with:

-  [Github Learning Lab Courses courses :thinking:](https://lab.github.com/githubtraining/write-a-learning-lab-course)
- [VTEX Store Framework Course definition](https://github.com/vtex-apps/store-framework-course)

## File Structure

![VTEX Course Template file structure](https://i.imgur.com/gIhAI2N.png)

The first important file to notice here is the **manifest.json**. It defines the **app name**, which will be used as the **repositories names** for the generated Learning Lab course (e.g: the app `vtex.my-course` will output a course on `vtex-trainings/my-course`, and itss template on `vtex-trainings/my-course-template`). It is also where's declared the use of **course@0.x** builder. There's no need to declared dependencies.

> **:warning: Important:** The major of the version should always be `0.x`, so keep that in mind!

## Course Definition

The first file you need when creating a VTEX IO Course is the `config.json`,  inside the `course/` folder. It defined **the course's configuration**: its name, description, and steps as well. There's support for **internationalization** out of the box for **english, portuguese and spanish.** 

> If you want to support other languages, keep in mind that some placeholders **will be in english**

```json
{
  "title": "Template Course",
  "tagline": "Like a subtitle for your course",
  "description": "Description of your course",
  "languages": ["en", "pt"],
  "steps": [
    {
      "folder": "01-hello-world",
      "title": { "en": "First assignment", "pt": "Primeira tarefa" },
      "description": {
        "en": "Description for the Hello World step (used solely for Github's progress page)",
        "pt": "Descri‹o para o step de Hello World"
      },
      "challenge": "none"
    },
    {
      "folder": "02-writing-jsonc",
      "title": {
        "en": "On this step, we have tests that check if some JSONC files were correctly made",
        "pt": "Neste passo teremos testes para verificar se alguns arquivos JSONC foram corretamente criados"
      },
      "description": { "en": "Second description", "pt": "Segunda descri‹o" },
      "challenge": "tests"
    },
    {
      "folder": "03-writing-css",
      "title": {
        "en": "Here, we will get some CSS files and parse them, checking if the correct classes were declared",
        "pt": "Aqui, iremos parsear arquivos CSS submetidos e verificar se as classes foram corretamente criadas"
      },
      "description": { "en": "Third description", "pt": "Terceira descri‹o" },
      "challenge": "tests"
    },
    {
      "folder": "04-wrapping-up",
      "title": {
        "en": "Here you can set another title for this step",
        "pt": "Aqui voc pode colocar outro t’tulo para seu step"
      },
      "description": {
        "en": "Every description is required for each step",
        "pt": "O campo descri‹o Ž obrigat—rio para todo step"
      },
      "challenge": "tests"
    }
  ]
}
```

`title`, `tagline`, `description`, `languages` and `steps` are all **required fields.** Even if you only want to export the course for one language, you have to specify it. For refering to the languages, use the following tokens:
| Language | Token |
|--|--|
| English | `en` |
| Portuguese | `pt` |
| Spanish | `es` |

> There's no support for internationalization of `title`,  `tagline` and description. It's advised to keep them in **english.**

### The steps

Each step of the course is described by the following fields:
 
| Field | Description |
|--|--|
| `folder` | The name of the folder on the app where the step content will be placed |
| `title` | The title of the step. This will be displayed on the course's summary |
| `description` | A short description for that step |
| `challenge` | The type of the challenge for that course |

Both `title` and `description` are localized, so you must define them using an object, mapping **the language** to their values.

Bear that the `folder` value **should not have spaces or special characters!**

#### Challenge

The challenge of each step it the **obstacle** that the student enrolled on the course must overcome to *pass* to the next step. Currently, we support **two types of challenges:**
| Challenge Token | What does it mean? |
|--|--|
| `none` | There's **no challenge for that step**, so the student must **close the current step's issue** to pass to the next one |
| `tests` | In order to pass, some tests will be run. Such tests are also defined on the course's app |

#### Step folder

For each step defined on the course's  `config.json`, you must define some files on the directory: `course/steps/{{folder}}`, where `folder` matches the field defined on the course's configuration. For example, for the first step of this template course, with `folder` equals `01-hello-world`, the directory `course/steps/01-hello-world` must exist.

> We advise **using the number of the step** on the folder name to better visualize large courses on the file tree

#### Step files

Inside the step's folder described above, there should be the following files:

- `{{language}}.md`s for each language that the course supports (e.g: `pt.md` and `en.md`). Inside this file must be **the step content!**
- A `index.ts` file **if the step has a `tests` challenge**.

#### Step tests

In order to help you define the course tests, we **ship some Typescript typings** along with this template, so, when cloning it to use as a boilerplate, **don't forget to keep them.** 

As described abover, a step can define **tests** on the `index.ts` file, inside step's folder. This file **exports a set of test cases**, which will be run **on every Github submission** when the student is at such step. Every test case has a `title` (e.g: "There should be a store.jsonc file on your store"), a `failMsg` to be displayed if the user fails that step and **the test function**, which is the actual code representing that test case.

```typescript 
export default {
  tests: [
    {
      description: 'First test of SECOND step',
      failMsg: 'You can also throw custom error messages. This will be the default message sent.',
      test: async({ ctx }) => {
        const pdp = await ctx.getFile('store/blocks/product.jsonc') 
        return !!pdp
      }
    }
  ]
} as TestCase
```

For every test file you should **export default** one `TestCase` object. The type definitions on the project will guide you how to develop the test functions.

> We currently **do not support** importing code on test files.


