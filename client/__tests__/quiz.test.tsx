import React from "react";
import Quiz, {
  FrontPage,
  MapQuestions,
  QuestionContext,
  ShowAnswer,
} from "../Quiz";
import { render, unmountComponentAtNode } from "react-dom";
import { Question } from "../questions";
import { MemoryRouter } from "react-router-dom";
import { act, Simulate } from "react-dom/test-utils";
import "regenerator-runtime/runtime";
import { QuestionAnimals } from "../quiestions-animals";
import fetchMock from "jest-fetch-mock";
import * as assert from "assert";

describe("quiz pages", () => {
  fetchMock.enableMocks();
  let container: HTMLDivElement;
  const question: QuestionAnimals = {
    question: "What is the slowest animal in the world?",
    id: 42,
    answers: {
      answer_a: "The turtle",
      answer_b: "The sloth",
    },
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "true",
    },
  };

  beforeEach(async () => {
    // setup a DOM element as a render target
    container = await document.createElement("div");
  });

  afterEach(async () => {
    // cleanup on exiting
    unmountComponentAtNode(await container);
  });

  /**-------------------------------------------------------------------------------------**/

  it("Should only test startpage", function () {
    render(
      <MemoryRouter>
        <Quiz />
      </MemoryRouter>,
      container
    );
    expect(container.innerHTML).toMatchSnapshot();
  });

  // sjekker MapQuestions-komponent, sender antall rette og totalt spm besvart, sjekker opp mot toEqual-metoden til Jest
  it("At MapQuestions: Should test questions answered and correct answered", async function () {
    const setQuestionsAnswered = await jest.fn();
    const setCorrectAnswered = await jest.fn();
    // todo forsøker noe i test med å mocke denne funksjonen på linje 62 i Quiz.tsx
    jest.mock("../Quiz", () => {
      return {
        question: jest.fn().mockImplementation(() => {}),
      };
    });

    render(
      <MemoryRouter initialEntries={["/question"]}>
        <MapQuestions
          questionsAnswered={5}
          correctAnswered={4}
          setQuestionsAnswered={setQuestionsAnswered}
          setCorrectAnswered={setCorrectAnswered}
        />
      </MemoryRouter>,
      container
    );

    await expect(
      container.querySelector("[data-testid=map-question-status]")?.textContent
    ).toEqual("4 / 5 correct answered");
  });

  // sjekker FrontPage-komponent, sender antall rette og totalt spm besvart, sjekker opp mot toEqual-metoden til Jest
  it("At FrontPage: Should test questions answered and correct answered", function () {
    render(
      <MemoryRouter>
        <FrontPage questionsAnswered={5} correctAnswered={4} />
      </MemoryRouter>,
      container
    );
    expect(
      container.querySelector("[data-testid=frontpage-status]")?.textContent
    ).toEqual("4 / 5 correct answered");
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("should register correct answer with simulate click", async function () {
    const setQuestionsAnswered = await jest.fn();
    const setCorrectAnswered = await jest.fn();

    act(() => {
      render(
        <MemoryRouter initialEntries={["/question"]}>
          <QuestionContext.Provider value={{ randomQuestion: () => question }}>
            <MapQuestions
              setCorrectAnswered={setCorrectAnswered}
              setQuestionsAnswered={setQuestionsAnswered}
              correctAnswered={1}
              questionsAnswered={1}
            />
          </QuestionContext.Provider>
          <ShowAnswer />
        </MemoryRouter>,
        container
      );
    });

    act(() => {
      Simulate.click(container.querySelector("[data-testid=answer_b] button")!);
    });
    await expect(setQuestionsAnswered).toBeCalled();
    await expect(setCorrectAnswered).toBeCalled();
    await expect(container.innerHTML).toMatchSnapshot();
    await expect(
      await container.querySelector("[data-testid=map-question-status]")
        ?.textContent
    ).toEqual("1 / 1 rette");
  });

  it("should register wrong answer with simulate click", function () {
    const setQuestionsAnswered = jest.fn();
    const setCorrectAnswered = jest.fn();

    render(
      <MemoryRouter initialEntries={["/question"]}>
        <QuestionContext.Provider value={{ randomQuestion: () => question }}>
          <MapQuestions
            setCorrectAnswered={setCorrectAnswered}
            setQuestionsAnswered={setQuestionsAnswered}
            correctAnswered={0}
            questionsAnswered={1}
          />
        </QuestionContext.Provider>
        <ShowAnswer />
      </MemoryRouter>,
      container
    );

    Simulate.click(container.querySelector("[data-testid=answer_a] button")!);
    expect(setQuestionsAnswered).toBeCalled();
    // bruker "not" her fordi den ikke skal bli kalt, fordi svaret er feil og setCorrectAnswered skal ikke kalles
    expect(setCorrectAnswered).not.toBeCalled();
    expect(container.innerHTML).toMatchSnapshot();
    expect(
      container.querySelector("[data-testid=map-question-status]")?.textContent
    ).toEqual("0 / 1 rette");
  });

  // henter ut keys(property) fra et array objekt
  it("should get keys from an array object", function () {
    const answerNames: string[] = Object.keys(question.answers).filter(
      (a: string) => question.answers[a]
    );
    expect(answerNames).toEqual(["answer_a", "answer_b"]);
  });

  // henter ut values fra et array objekt
  it("should get values from an array object", function () {
    const answerValues = Object.values(question.answers).filter(
      (a: string | null) => a !== null
    );
    expect(answerValues).toEqual(["The turtle", "The sloth"]);
  });
});
