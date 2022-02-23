import React from "react";
import Quiz, { FrontPage, MapQuestions, Score } from "../Quiz";
import { render, unmountComponentAtNode } from "react-dom";
import { MemoryRouter } from "react-router-dom";
import { act, Simulate } from "react-dom/test-utils";
import "regenerator-runtime/runtime";
import { QuestionAnimals, randomQuestion } from "../quiestions-animals";
import { useLoader } from "../hooks/useLoader";
import { fetchJSON } from "../api/http";
import Mock = jest.Mock;
import { QuestionContext } from "../contexts/context";

describe("quiz pages", () => {
  let container: HTMLDivElement;

  /*   const questionApi = {
    listQuestion: () => [
      {
        id: 42,
        question: "What is the slowest animal in the" + " world?",
        answers: {
          answer_a: "The turtle",
          answer_b: "The sloth",
        },
        correct_answers: {
          answer_a_correct: "false",
          answer_b_correct: "true",
        },
      },
    ],
  }; */
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

  it("Should only render startpage", async function () {
    await act(async () => {
      await render(
        <MemoryRouter>
          <Quiz />
        </MemoryRouter>,
        container
      );
    });
    expect(container.innerHTML).toMatchSnapshot();
  });

  // sjekker Score komponent, sender antall rette og totalt spm besvart
  it("At Score: Should test questions answered and correct answered", function () {
    render(
      <MemoryRouter>
        <Score correct={4} answered={5} />
      </MemoryRouter>,
      container
    );

    expect(
      container.querySelector("[data-testid=score-status]")?.textContent
    ).toEqual("4 / 5 correct answered");
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("At FrontPage: Should test questions answered and correct answered", function () {
    render(
      <MemoryRouter>
        <FrontPage correct={4} answered={5} />
      </MemoryRouter>,
      container
    );
    expect(
      container.querySelector("[data-testid=frontpage-score-status]")
        ?.textContent
    ).toEqual("4 / 5 correct answered");
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("should register correct answer with simulate click", async function () {
    const answered: Mock<number> = jest.fn();
    const correct: Mock<number> = jest.fn();
    const reload = jest.fn();

    jest.mock("../contexts/context", () => ({
      // todo et eller annet her
    }));

    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/question"]}>
          <QuestionContext.Provider value={{ randomQuestion: () => question }}>
            <MapQuestions
              correct={correct}
              answered={answered}
              reload={reload}
            />
          </QuestionContext.Provider>
        </MemoryRouter>,
        container
      );
    });

    Simulate.click(container.querySelector("[data-testid=answer_b] button")!);
    expect(answered).toBeCalled();
    expect(correct).toBeCalled();
    expect(container.innerHTML).toMatchSnapshot();
    expect(
      container.querySelector("[data-testid=score-status]")?.textContent
    ).toEqual("1 / 1 correct answered");
  });

  it("should register wrong answer with simulate click", async function () {
    const answered = jest.fn();
    const correct = jest.fn();
    const reload = jest.fn();

    jest.mock("../contexts/context", () => ({
      // todo et eller annet her
    }));

    await act(() => {
      render(
        <MemoryRouter initialEntries={["/question"]}>
          <QuestionContext.Provider value={{ randomQuestion: () => question }}>
            <MapQuestions
              correct={correct}
              answered={answered}
              reload={reload}
            />
          </QuestionContext.Provider>
        </MemoryRouter>,
        container
      );
    });

    Simulate.click(container.querySelector("[data-testid=answer_a] button")!);
    expect(answered).toBeCalled();
    // bruker "not" her fordi den ikke skal bli kalt, fordi svaret er feil og setCorrectAnswered skal ikke kalles
    expect(correct).not.toBeCalled();
    expect(container.innerHTML).toMatchSnapshot();
    expect(
      container.querySelector("[data-testid=score-status]")?.textContent
    ).toEqual("0 / 1 correct answered");
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
