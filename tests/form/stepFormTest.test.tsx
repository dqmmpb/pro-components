﻿import { mount } from 'enzyme';
import React from 'react';
import { Button } from 'antd';
import { act } from 'react-dom/test-utils';
import { StepsForm, StepsFormProps, ProFormText } from '@ant-design/pro-form';
import { waitForComponentToPaint } from '../util';

describe('StepsForm', () => {
  it('🐲 basic use', () => {
    const html = mount(
      <StepsForm>
        <StepsForm.StepFrom title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom title="表单3">
          <ProFormText name="地址" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );
    expect(html.find('span.ant-steps-icon').length).toBe(3);
    expect(html.find('div.ant-steps-item-title').at(0).text()).toBe('表单1');
    expect(html.find('div.ant-steps-item-title').at(1).text()).toBe('表单2');
    expect(html.find('div.ant-steps-item-title').at(2).text()).toBe('表单3');
    html.unmount();
  });

  it('🐲 stepsRender', () => {
    const html = mount<StepsFormProps>(
      <StepsForm stepsRender={() => null}>
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="extraInfo" title="表单3">
          <ProFormText name="地址" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );

    expect(html.find('.ant-steps').exists()).toBeFalsy();

    act(() => {
      html.setProps({
        stepsRender: (_, dom) => <div id="test">{dom}</div>,
      });
    });

    expect(html.find('.ant-steps').exists()).toBeTruthy();
    expect(html.find('div#test').exists()).toBeTruthy();
    html.unmount();
  });

  it('🐲 pre button ', async () => {
    const onCurrentChange = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={1}
        onCurrentChange={(current) => {
          onCurrentChange(current);
        }}
      >
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="extraInfo" title="表单3">
          <ProFormText name="地址" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );
    await waitForComponentToPaint(html, 100);
    act(() => {
      html.find('button.ant-btn').at(0).simulate('click');
    });
    expect(onCurrentChange).toBeCalledWith(0);
    html.unmount();
  });

  it('🐲 async onFinish', async () => {
    const fn = jest.fn();
    const currentFn = jest.fn();
    const onFinish = jest.fn();

    const html = mount<StepsFormProps>(
      <StepsForm onCurrentChange={currentFn} onFinish={onFinish}>
        <StepsForm.StepFrom
          name="base"
          title="表单1"
          onFinish={async (values) => {
            fn(values);
            return true;
          }}
        >
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);

    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(html);

    expect(fn).toBeCalled();
    expect(currentFn).toBeCalled();

    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(html);
    expect(onFinish).toBeCalled();
    html.unmount();
  });

  it('🐲 onFinish is null', async () => {
    const fn = jest.fn();
    const currentFn = jest.fn();

    const html = mount<StepsFormProps>(
      <StepsForm onCurrentChange={currentFn}>
        <StepsForm.StepFrom
          name="base"
          title="表单1"
          onFinish={async (values) => {
            fn(values);
            return true;
          }}
        >
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );
    await waitForComponentToPaint(html);

    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });

    await waitForComponentToPaint(html);

    expect(fn).toBeCalled();
    expect(currentFn).toBeCalled();

    act(() => {
      html.find('button.ant-btn.ant-btn-primary').simulate('click');
    });
    await waitForComponentToPaint(html);
    html.unmount();
  });

  it('🐲 submitter render=false', () => {
    const html = mount<StepsFormProps>(
      <StepsForm
        submitter={{
          render: false,
        }}
      >
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );

    expect(html.find('button.ant-btn.ant-btn-primary').exists()).toBeFalsy();
  });

  it('🐲 submitter render props', async () => {
    const fn = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={1}
        onCurrentChange={(current) => fn(current)}
        submitter={{
          render: (props) => {
            return (
              <button type="button" id="rest" onClick={() => props?.onReset?.()}>
                rest
              </button>
            );
          },
        }}
      >
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );

    expect(html.find('button#rest').exists()).toBeTruthy();

    act(() => {
      html.find('button#rest').simulate('click');
    });
    await waitForComponentToPaint(html);

    expect(fn).toBeCalledWith(0);
  });

  it('🐲 current min=0', async () => {
    const fn = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={0}
        onCurrentChange={(current) => {
          fn(current);
        }}
        submitter={{
          render: (props) => {
            return (
              <button type="button" id="rest" onClick={() => props?.onReset?.()}>
                rest
              </button>
            );
          },
        }}
      >
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );
    /**
     *  因为上一步有限制，所以应该不触发
     */
    act(() => {
      html.find('button#rest').simulate('click');
    });
    await waitForComponentToPaint(html);

    expect(fn).toBeCalledTimes(0);
  });

  it('🐲 current max=1', async () => {
    const fn = jest.fn();
    const html = mount<StepsFormProps>(
      <StepsForm
        current={0}
        onCurrentChange={(current) => {
          fn(current);
        }}
        submitter={{
          render: (props) => {
            return (
              <button type="button" id="rest" onClick={() => props?.onSubmit?.()}>
                rest
              </button>
            );
          },
        }}
      >
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );
    /**
     *  因为下一步有限制，所以应该不触发
     */
    act(() => {
      html.find('button#rest').simulate('click');
    });
    await waitForComponentToPaint(html);

    expect(fn).toBeCalledTimes(0);
  });

  it('🐲 submitter=false', () => {
    const html = mount<StepsFormProps>(
      <StepsForm submitter={false}>
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );

    expect(
      html.find('.ant-pro-steps-form-step-active button.ant-btn.ant-btn-primary').exists(),
    ).toBeFalsy();
    html.unmount();
  });

  it('🐲 submitter render function', () => {
    const html = mount<StepsFormProps>(
      <StepsForm
        submitter={{
          render: () => {
            return (
              <Button id="next" key="next">
                下一步
              </Button>
            );
          },
        }}
      >
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );

    expect(html.find('button#next').exists()).toBeTruthy();

    html.unmount();
  });

  it('🐲 support stepsFormRender', () => {
    const html = mount<StepsFormProps>(
      <StepsForm
        stepsFormRender={(dom, submitter) => {
          return (
            <div>
              <div id="content">{dom}</div>
              <div id="footer">{submitter} </div>
            </div>
          );
        }}
      >
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );
    expect(html.find('#content form').length).toBe(2);
    expect(html.find('#content form').exists()).toBeTruthy();
    expect(html.find('#footer button').exists()).toBeTruthy();
  });

  it('🐲 support stepsFormRender', () => {
    const html = mount<StepsFormProps>(
      <StepsForm
        stepFormRender={(dom) => {
          return <div id="content">{dom}</div>;
        }}
      >
        <StepsForm.StepFrom name="base" title="表单1">
          <ProFormText name="姓名" />
        </StepsForm.StepFrom>
        <StepsForm.StepFrom name="moreInfo" title="表单2">
          <ProFormText name="邮箱" />
        </StepsForm.StepFrom>
      </StepsForm>,
    );
    expect(html.find('#content').length).toBe(1);
    expect(html.find('form #content').length).toBe(1);
    expect(html.find('form').length).toBe(2);
    expect(html.find('form #content').exists()).toBeTruthy();
  });
});
