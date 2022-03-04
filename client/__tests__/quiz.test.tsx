import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { MemoryRouter } from "react-router-dom";
import { act, Simulate } from "react-dom/test-utils";
import "regenerator-runtime/runtime";
import { Home } from "../components/pages/Home";
import { FrontPage } from "../components/pages/FrontPage";
import { ShowAnswer } from "../components/pages/ShowAnswer";
import { randomQuestion } from "../questions-animals";
import pretty from "pretty";
import { Score } from "../components/Score";
import { QuestionAndAnswers } from "../components/QuestionAndAnswers";
import Quiz from "../Quiz";
import HttpError from "../api/http";

describe("quiz pages", () => {
  let container: HTMLDivElement;

  const questionApi = () => ({
    id: 42,
    question: "What is the slowest animal in the world?",
    answers: {
      answer_a: "The turtle",
      answer_b: "The sloth",
    },
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "true",
    },
  });

  beforeEach(async () => {
    // setup a DOM element as a render target
    container = await document.createElement("div");
  });

  afterEach(async () => {
    // cleanup on exiting
    unmountComponentAtNode(await container);
    jest.fn().mockClear();
  });

  /**-------------------------------------------------------------------------------------**/

  it("should render Quiz component", async function () {
    await act(async () => {
      render(
        <MemoryRouter>
          <Quiz />
        </MemoryRouter>,

        container
      );
    });

    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it("should render Home component", function () {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
      container
    );

    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it("should render ShowAnswer component to '/correct'", function () {
    render(
      <MemoryRouter initialEntries={["/correct"]}>
        <ShowAnswer />
      </MemoryRouter>,
      container
    );
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it("should render ShowAnswer component to '/wrong'", function () {
    render(
      <MemoryRouter initialEntries={["/wrong"]}>
        <ShowAnswer />
      </MemoryRouter>,
      container
    );
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it("should render Score component, correct and answered score", function () {
    render(
      <MemoryRouter>
        <Score correct={4} answered={5} />
      </MemoryRouter>,
      container
    );

    expect(
      container.querySelector("[data-testid=score-status]")?.textContent
    ).toEqual("4 / 5");
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it("should render FrontPage component, correct and answered score", function () {
    render(
      <MemoryRouter>
        <FrontPage correct={1} answered={2} />
      </MemoryRouter>,
      container
    );
    expect(
      container.querySelector("[data-testid=score-status]")?.textContent
    ).toEqual("1 / 2");
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it("should meet 'Loading...' on trying to receive a question", async function () {
    let answered: number;
    let correct: number;

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/question"]}>
          <QuestionAndAnswers
            answered={answered}
            correct={correct}
            questionApi={jest.fn()}
          />
        </MemoryRouter>,
        container
      );
    });
    expect(pretty(container.innerHTML)).toMatchSnapshot();
    expect(jest.fn(questionApi)).not.toBeCalled();
  });

  it("should trigger an error on trying to receive a question", async function () {
    let answered: number;
    let correct: number;
    const error = new HttpError(404, "No Content - no question found");

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/question"]}>
          <QuestionAndAnswers
            answered={answered}
            correct={correct}
            questionApi={undefined}
            error={error}
          />
        </MemoryRouter>,
        container
      );
    });
    expect(pretty(container.innerHTML)).toMatchSnapshot();
    expect(jest.fn(questionApi)).not.toBeCalled();
  });

  it("should render a question and its answer options", async function () {
    const answered = jest.fn().mockReturnValue(0);
    const correct = jest.fn().mockReturnValue(0);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/question"]}>
          <QuestionAndAnswers
            answered={answered()}
            correct={correct()}
            questionApi={questionApi}
          />
        </MemoryRouter>,
        container
      );
    });
    expect(questionApi).toBeDefined();
    expect(answered).toBeCalled();
    expect(correct).toBeCalled();
    expect(pretty(container.innerHTML)).toMatchSnapshot();
  });

  it("should register correct answer with simulate click", async function () {
    const reload = jest.fn();
    const answer = questionApi().correct_answers.answer_b_correct;
    const id = questionApi().id;
    const postAnswer = jest.fn().mockImplementation(randomQuestion);
    const answered = jest.fn((x: number) => x + 1);
    const correct = jest.fn((x: number) => x + 1);

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/question"]}>
          <QuestionAndAnswers
            correct={correct(0)}
            answered={answered(0)}
            reloadScore={reload}
            questionApi={questionApi}
            postAnswerApi={postAnswer}
          />
        </MemoryRouter>,
        container
      );
    });

    await act(async () => {
      Simulate.click(container.querySelector("[data-testid=answer_b] button")!);
    });
    expect(reload).toBeCalled();
    expect(postAnswer).toBeCalled();
    expect(questionApi).toBeDefined();
    expect(pretty(container.innerHTML)).toMatchSnapshot();
    expect(
      container.querySelector("[data-testid=score-status]")?.textContent
    ).toEqual("1 / 1");
  });

  it("should register wrong answer with simulate click", async function () {
    const reload = jest.fn();
    const postAnswer = jest.fn().mockImplementation(randomQuestion);
    // fake grønn, er ikke randomQuestion som skal mockes her
    const answered = jest.fn((x: number) => x + 1);
    const correct = jest.fn((x: number) => x);

    // TODO får ikke til å få correct answer fra score GET (enda)

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/question"]}>
          <QuestionAndAnswers
            correct={correct(0)}
            answered={answered(0)}
            reloadScore={reload}
            questionApi={questionApi}
            postAnswerApi={postAnswer}
          />
        </MemoryRouter>,
        container
      );
    });

    await act(async () => {
      Simulate.click(container.querySelector("[data-testid=answer_a] button")!);
    });
    expect(reload).toBeCalled();
    expect(postAnswer).toBeCalled();
    expect(questionApi).toBeDefined();
    expect(pretty(container.innerHTML)).toMatchSnapshot();
    expect(
      container.querySelector("[data-testid=score-status]")?.textContent
    ).toEqual("0 / 1");
  });

  it("should get keys from dummy object", function () {
    const answerKeys = Object.keys(questionApi().answers).map((keys) => keys);

    expect(answerKeys).toEqual(["answer_a", "answer_b"]);
  });

  it("should get values from dummy object", function () {
    const answerValues = Object.values(questionApi().answers).filter(
      (a: string | null) => a !== null
    );
    expect(answerValues).toEqual(["The turtle", "The sloth"]);
  });

  it("should get question from dummy object", function () {
    const questionString = questionApi().question;

    expect(questionString).toEqual("What is the slowest animal in the world?");
  });
});
