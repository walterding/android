#N → a ( N, N )
#N → ε

class Node:
    pass

expression='A(B(C,),)'
offset=0

lookahead=expression[0]

###############递归下降###########
def root():
    global lookahead
    if offset>=len(expression):

        return

    if lookahead==',' or lookahead=='(' or lookahead==')':
        lookahead=''
        pass

    if lookahead!='':
        node=Node()

        matchV()
        node.value=lookahead

        match('(')

        node.left=root()

        match(',')

        node.right =root()

        match(')')

        return node
    else:
        matchEmpty()
        return None

def matchEmpty():
    global lookahead
    lookahead=expression[offset]


def matchV():
    global expression
    global offset
    global lookahead

    lookahead = expression[offset + 1]
    offset = offset + 1

def match(char):
    global expression
    global offset
    global lookahead

    if lookahead==char:

        lookahead=expression[offset+1]
        offset=offset+1
    else:
        raise
             
       
###############堆栈###########
def parse_tree():

    stack = []
    grammar = 0

    for i in range(len(stmt)):
        if stmt[i]=='(':
            grammar=1
            pass
        elif stmt[i]==')':
            grammar=0
            node=stack.pop(0)
            pass
        elif stmt[i]==',':
            grammar=2
            pass
        else:
            _node=Node()
            _node.value=expression[i]

            if(grammar==1):
                stack[0].left=_node
            elif(grammar==2):
                stack[0].right=_node

            stack.insert(0, _node)

    return node
