

      # --------------Python GUI - 07 | ComboBox |---------------

# A combo box, short for "combination box" or "dropdown box", is a graphical user interface
# element commonly used in software applications. It's a combination of a text box and a drop-down
# list, allowing users to either type in a value or select from a list of predefined option. The
# primary features of a combo box include:

#     1: Text Box:
#           ** The combo box includes a text box area where users can manually input a value.
#           This is useful when the desired option is not the predefined list.

#     2: Drop-down List:
#           ** Adjacent to the text box, there is a small buttons or arrow.
#           When clicked or activated, it opens a drop-down list that displays a set of
#           selectable options. Users can choose from this list.

#     3: Selection Mechanism:
#           ** Users can either type a value directly into the box or choose from the
#           drop-down list. The selected option is then displayed in the text box area.

#     4: Use cases:

#           ** Selection from a list 
#               Combo boxes are commonly used when there is a predefined set of options, and
#               users need to choose from that list.

#           ** Editable Text:
#               The ability to type in the text box makes combo boxes suitable for scenarios where 
#               users might want to input a custom value not present in the predefined list.

#     5: Variants:
#           ** Depending on the platform and the user interface framework, combo boxes may
#             have different appearances and behaviors. In web development, you might 
#             encounter similar functionality implemented using '<select>' and '<input>'
#             HTML elements.

#       <select>
#           <option value="option1">Option 1</option>
#           <option value="option2">Option 2</option>
#           <option value="option3">Option 3</option>
#       </select>

#    In this HTML example, the '<select>' element creates a dropdown list, and the '<option>'
#     elements represent individual options within the combo box.

# combo boxes are widely used in various software applications, providing an efficient way for
# users to intract with a system choosing from a predefined set of options or entering custom 
# values.

# import tkinter as tk
# from tkinter import ttk
# from calendar import month_name


# root = tk.Tk()

# root.title('Combobox')
# root.geometry('300x200')
# root.resizable(False, False)

# combobox = ttk.Combobox(root, values=['Python', 'Java', 'C++'])
# combobox.pack()

# # print(month_name)
# # >>> nothing
# print(month_name[1])
# # >>> January 
# print(month_name[2])
# # >>> February

# root.mainloop()

# ---------------------

# import tkinter as tk
# from tkinter import ttk
# from calendar import month_name

# root = tk.Tk()

# root.title('Combobox')
# root.geometry('300x200')
# root.resizable(False, False)

# month_name = [month_name[i] for i in range(1, 13)]
# print(month_name)
# # >>>> ['January, Feb ....', 'December']


# combobox = ttk.Combobox(root, values=['Python', 'Java', 'C++'])
# combobox.pack()

# root.mainloop()

## now we try to set these month values to our combobox

import tkinter as tk
from tkinter import ttk
from calendar import month_name

root = tk.Tk()

root.title('Combobox')
root.geometry('300x200')
root.resizable(False, False)

selected_month = tk.StringVar()


month_names = [month_name[i] for i in range(1, 13)]
# print(month_names)
# >>>> ['January, Feb ....', 'December']


combobox = ttk.Combobox(root, values=month_names, textvariable=selected_month)
combobox.pack()

label = ttk.Label(root, textvariable=selected_month)
label.pack()


root.mainloop()

# ------------- lesson 7 is over ----------







