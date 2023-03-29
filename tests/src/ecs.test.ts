import { expect, test } from "@jest/globals";
import { Scene } from "retro-engine/build/scene";
import TestEntity from "../projects/test_project/scripts/entities/TestEntity.js";
import Counter from "../projects/test_project/scripts/components/Counter.js";
import DependencyTest from "../projects/test_project/scripts/components/DependencyTest.js";

test("Game Object Functionality", () => {
    const scene = new Scene("");

    const testEntity: any = new TestEntity("test");
    scene.addEntity(testEntity);
    scene.update();
    scene.update();

    expect(testEntity.counter).toBe(2);
    expect(testEntity.onCreateRun).toBe(true);
    expect(testEntity.onDeleteRun).toBe(false);
    scene.deleteEntity("test");
    expect(testEntity.onDeleteRun).toBe(true);
});

test("System Functionality", () => {
    const scene = new Scene("");

    const testEntity: any = new TestEntity("test");
    testEntity.add(new Counter());
    scene.addEntity(testEntity);
    console.log("TODO: test fails because systems are not being added properly");
    console.log("systems", scene.systems);
    scene.update();
    scene.update();

    expect(testEntity.counter).toBe(2);
    expect(testEntity.getByName("Counter").counter).toBe(2);
    expect(testEntity.getAllComponents()).toEqual(["Counter"]);
});

test("Component Functionality", () => {
    const testEntity: any = new TestEntity("test");

    testEntity.add(new Counter());

    const counter = testEntity.getByName("Counter");

    expect(counter.onCreateRun).toBe(true);
    expect(counter.onDeleteRun).toBe(false);

    testEntity.removeByName("Counter");

    expect(testEntity.getByName("Counter")).toBe(undefined);
    expect(counter.onDeleteRun).toBe(true);
});

test("Component Dependencies", () => {
    const scene = new Scene("");

    const testEntity: any = new TestEntity("test");

    expect(() => testEntity.add(new DependencyTest())).toThrowError('Component \'DependencyTest\' requires \'Counter\'');
    testEntity.add(new Counter());
    testEntity.add(new DependencyTest());
    scene.addEntity(testEntity);
    scene.update();
    scene.update();

    expect(testEntity.hasAll([Counter, DependencyTest])).toBe(true);
    expect(testEntity.counter).toBe(2);
    expect(testEntity.get(Counter).counter).toBe(2);
});
