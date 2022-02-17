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
import { Simulate } from "react-dom/test-utils";
import "regenerator-runtime/runtime";
import { QuestionAnimals } from "../quiestions-animals";

describe("quiz pages", () => {
  let container: HTMLDivElement;
  const question: QuestionAnimals = {
    question: "Hva er det tregeste dyret i verden?",
    id: 42,
    answers: {
      answer_a: "Skilpadden",
      answer_b: "Dovendyret",
    },
    correct_answers: {
      answer_a_correct: "false",
      answer_b_correct: "true",
    },
  };

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
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

    render(
      <MemoryRouter>
        <MapQuestions
          questionsAnswered={5}
          correctAnswered={4}
          setQuestionsAnswered={setQuestionsAnswered}
          setCorrectAnswered={setCorrectAnswered}
        />
      </MemoryRouter>,
      await container
    );
    await expect(
      container.querySelector("[data-testid=map-question-status]")?.textContent
    ).toEqual("4 / 5 rette");
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
    ).toEqual("4 / 5 rette");
    expect(container.innerHTML).toMatchSnapshot();
  });

  it("should register correct answer with simulate click", async function () {
    const setQuestionsAnswered = await jest.fn();
    const setCorrectAnswered = await jest.fn();

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

    await Simulate.click(
      container.querySelector("[data-testid=answer_b] button")!
    );
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
    expect(answerValues).toEqual(["Skilpadden", "Dovendyret"]);
  });
});
